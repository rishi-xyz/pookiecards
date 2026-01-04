use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer, transfer};

use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct TransferCard<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    
    pub to: SystemAccount<'info>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        mut,
        associated_token::mint = card_mint,
        associated_token::authority = from,
    )]
    pub from_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = from,
        associated_token::mint = card_mint,
        associated_token::authority = to,
    )]
    pub to_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"user_stats", from.key().as_ref()],
        bump
    )]
    pub from_stats: Account<'info, UserStats>,
    
    #[account(
        mut,
        seeds = [b"user_stats", to.key().as_ref()],
        bump
    )]
    pub to_stats: Account<'info, UserStats>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LevelUpCard<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        mut,
        seeds = [b"user_stats", owner.key().as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
}

#[derive(Accounts)]
pub struct AddExperience<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        mut,
        seeds = [b"user_stats", pookie_card.owner.as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
}

#[derive(Accounts)]
pub struct UpdateCardStats<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + CardCollection::INIT_SPACE,
        seeds = [b"collection", authority.key().as_ref()],
        bump
    )]
    pub collection: Account<'info, CardCollection>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn transfer_card(ctx: Context<TransferCard>) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(
        ctx.accounts.pookie_card.owner == ctx.accounts.from.key(),
        ErrorCode::NotCardOwner
    );
    require!(!ctx.accounts.pookie_card.is_listed, ErrorCode::AlreadyListed);
    
    // Transfer token
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.from.to_account_info(),
        },
    );
    
    transfer(cpi_ctx, 1)?;
    
    // Update card ownership
    let pookie_card = &mut ctx.accounts.pookie_card;
    pookie_card.owner = ctx.accounts.to.key();
    pookie_card.last_updated = clock.unix_timestamp;
    
    // Update user stats
    let from_stats = &mut ctx.accounts.from_stats;
    from_stats.cards_owned -= 1;
    from_stats.last_activity = clock.unix_timestamp;
    
    let to_stats = &mut ctx.accounts.to_stats;
    to_stats.cards_owned += 1;
    to_stats.last_activity = clock.unix_timestamp;
    
    Ok(())
}

pub fn level_up_card(ctx: Context<LevelUpCard>) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(
        ctx.accounts.pookie_card.owner == ctx.accounts.owner.key(),
        ErrorCode::NotCardOwner
    );
    
    let pookie_card = &mut ctx.accounts.pookie_card;
    let max_level = pookie_card.rarity.max_level();
    
    require!(pookie_card.level < max_level, ErrorCode::MaxLevelReached);
    
    let required_exp = get_required_experience(pookie_card.level);
    require!(pookie_card.experience >= required_exp, ErrorCode::InsufficientExperience);
    
    // Level up the card
    pookie_card.level += 1;
    pookie_card.experience -= required_exp;
    pookie_card.last_updated = clock.unix_timestamp;
    
    // Increase stats based on rarity
    let stat_increase = match pookie_card.rarity {
        CardRarity::Common => 1,
        CardRarity::Uncommon => 2,
        CardRarity::Rare => 3,
        CardRarity::Epic => 4,
        CardRarity::Legendary => 5,
        CardRarity::Mythic => 7,
    };
    
    pookie_card.attack += stat_increase;
    pookie_card.defense += stat_increase;
    pookie_card.health += stat_increase * 2;
    
    // Update user stats
    let user_stats = &mut ctx.accounts.user_stats;
    user_stats.last_activity = clock.unix_timestamp;
    user_stats.experience += 100 * pookie_card.level as u64;
    
    // Check if user should level up
    let user_required_exp = get_user_required_experience(user_stats.level);
    if user_stats.experience >= user_required_exp && user_stats.level < 100 {
        user_stats.level += 1;
    }
    
    Ok(())
}

pub fn add_experience(ctx: Context<AddExperience>, amount: u32) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(amount > 0, ErrorCode::InvalidLevel);
    
    let pookie_card = &mut ctx.accounts.pookie_card;
    pookie_card.experience += amount;
    pookie_card.last_updated = clock.unix_timestamp;
    
    // Update user stats
    let user_stats = &mut ctx.accounts.user_stats;
    user_stats.last_activity = clock.unix_timestamp;
    
    Ok(())
}

pub fn update_card_stats(
    ctx: Context<UpdateCardStats>,
    new_attack: Option<u8>,
    new_defense: Option<u8>,
    new_health: Option<u8>,
    new_special_ability: Option<Option<String>>,
) -> Result<()> {
    let clock = Clock::get()?;
    
    let pookie_card = &mut ctx.accounts.pookie_card;
    
    if let Some(attack) = new_attack {
        pookie_card.attack = attack;
    }
    
    if let Some(defense) = new_defense {
        pookie_card.defense = defense;
    }
    
    if let Some(health) = new_health {
        pookie_card.health = health;
    }
    
    if let Some(special_ability) = new_special_ability {
        pookie_card.special_ability = special_ability;
    }
    
    pookie_card.last_updated = clock.unix_timestamp;
    
    Ok(())
}

pub fn create_collection(
    ctx: Context<CreateCollection>,
    name: String,
    description: String,
    max_supply: Option<u64>,
) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(!name.is_empty(), ErrorCode::InvalidLevel);
    require!(name.len() <= 50, ErrorCode::InvalidLevel);
    require!(description.len() <= 200, ErrorCode::InvalidLevel);
    
    let collection = &mut ctx.accounts.collection;
    collection.authority = ctx.accounts.authority.key();
    collection.name = name;
    collection.description = description;
    collection.total_cards = 0;
    collection.max_supply = max_supply;
    collection.created_at = clock.unix_timestamp;
    collection.is_active = true;
    
    Ok(())
}

fn get_required_experience(level: u8) -> u32 {
    match level {
        1 => 100,
        2 => 250,
        3 => 450,
        4 => 700,
        5 => 1000,
        6 => 1400,
        7 => 1900,
        8 => 2500,
        9 => 3200,
        10 => 4000,
        _ => 4000 + ((level as u32 - 10) * 800),
    }
}

fn get_user_required_experience(level: u8) -> u64 {
    match level {
        1 => 0,
        2 => 1000,
        3 => 2500,
        4 => 5000,
        5 => 8500,
        6 => 13000,
        7 => 18500,
        8 => 25000,
        9 => 32500,
        10 => 41000,
        _ => 41000 + ((level as u64 - 10) * 10000),
    }
}
