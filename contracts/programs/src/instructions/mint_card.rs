use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, mint_to, MintTo};
use anchor_spl::metadata::{Metadata, MetadataAccount, MasterEdition, MasterEditionAccount, CreateMasterEdition, CreateMetadataAccountsV3, CreateMetadataAccountsV3InstructionArgs};
use anchor_spl::associated_token::AssociatedToken;

use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(card_id: u64, name: String, rarity: CardRarity, element: CardElement)]
pub struct MintCard<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 8 + PookieCard::INIT_SPACE,
        seeds = [b"pookie_card", card_id.to_le_bytes().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
        mint::freeze_authority = payer,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is the metadata account that will be created
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: This is the master edition account that will be created
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    
    #[account(
        mut,
        seeds = [b"user_stats", payer.key().as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    
    #[account(
        mut,
        seeds = [b"collection", collection_authority.key().as_ref()],
        bump
    )]
    pub collection: Account<'info, CardCollection>,
    
    /// CHECK: This is the collection authority
    pub collection_authority: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> MintCard<'info> {
    pub fn validate(
        ctx: &Context<MintCard>,
        rarity: &CardRarity,
        element: &CardElement,
    ) -> Result<()> {
        // Validate collection is active
        require!(ctx.accounts.collection.is_active, ErrorCode::CollectionNotFound);
        
        // Check max supply if set
        if let Some(max_supply) = ctx.accounts.collection.max_supply {
            require!(
                ctx.accounts.collection.total_cards < max_supply,
                ErrorCode::MaxSupplyReached
            );
        }
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUserStats<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + UserStats::INIT_SPACE,
        seeds = [b"user_stats", payer.key().as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<MintCard>, card_id: u64, name: String, rarity: CardRarity, element: CardElement) -> Result<()> {
    let clock = Clock::get()?;
    
    // Validate inputs
    MintCard::validate(&ctx, &rarity, &element)?;
    
    // Get base stats from rarity
    let (base_attack, base_defense, base_health) = rarity.base_stats();
    
    // Create metadata
    let metadata_data = CreateMetadataAccountsV3InstructionArgs {
        data: anchor_spl::metadata::MetadataV3 {
            name: name.clone(),
            symbol: "POOKIE".to_string(),
            uri: format!("https://api.pookiecards.com/metadata/{}", card_id),
            seller_fee_basis_points: 500, // 5%
            creators: Some(vec![
                anchor_spl::metadata::Creator {
                    address: ctx.accounts.collection_authority.key(),
                    verified: true,
                    share: 100,
                },
            ]),
            collection: Some(anchor_spl::metadata::Collection {
                key: ctx.accounts.collection.key(),
                verified: false,
            }),
            uses: None,
        },
        is_mutable: true,
        collection_details: None,
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_metadata_program.to_account_info(),
        CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            mint_authority: ctx.accounts.payer.to_account_info(),
            update_authority: ctx.accounts.payer.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
    );
    
    anchor_spl::metadata::create_metadata_accounts_v3(cpi_ctx, metadata_data)?;
    
    // Create master edition
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_metadata_program.to_account_info(),
        CreateMasterEdition {
            edition: ctx.accounts.master_edition.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            update_authority: ctx.accounts.payer.to_account_info(),
            mint_authority: ctx.accounts.payer.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
            metadata: ctx.accounts.metadata.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
    );
    
    create_master_edition(cpi_ctx, Some(0))?;
    
    // Mint token to user
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        },
    );
    
    mint_to(cpi_ctx, 1)?;
    
    // Initialize PookieCard
    let pookie_card = &mut ctx.accounts.pookie_card;
    pookie_card.mint = ctx.accounts.mint.key();
    pookie_card.owner = ctx.accounts.payer.key();
    pookie_card.card_id = card_id;
    pookie_card.name = name;
    pookie_card.rarity = rarity;
    pookie_card.element = element;
    pookie_card.attack = base_attack;
    pookie_card.defense = base_defense;
    pookie_card.health = base_health;
    pookie_card.special_ability = Some("Basic Attack".to_string());
    pookie_card.level = 1;
    pookie_card.experience = 0;
    pookie_card.created_at = clock.unix_timestamp;
    pookie_card.last_updated = clock.unix_timestamp;
    pookie_card.is_listed = false;
    pookie_card.listing_price = None;
    
    // Update user stats
    let user_stats = &mut ctx.accounts.user_stats;
    user_stats.cards_owned += 1;
    user_stats.cards_minted += 1;
    user_stats.last_activity = clock.unix_timestamp;
    
    // Update collection stats
    let collection = &mut ctx.accounts.collection;
    collection.total_cards += 1;
    
    Ok(())
}

pub fn initialize_user_stats(ctx: Context<InitializeUserStats>) -> Result<()> {
    let clock = Clock::get()?;
    
    let user_stats = &mut ctx.accounts.user_stats;
    user_stats.owner = ctx.accounts.payer.key();
    user_stats.cards_owned = 0;
    user_stats.cards_minted = 0;
    user_stats.total_spent = 0;
    user_stats.total_earned = 0;
    user_stats.battles_won = 0;
    user_stats.battles_lost = 0;
    user_stats.experience = 0;
    user_stats.level = 1;
    user_stats.created_at = clock.unix_timestamp;
    user_stats.last_activity = clock.unix_timestamp;
    
    Ok(())
}
