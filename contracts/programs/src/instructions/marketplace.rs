use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;

use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Marketplace::INIT_SPACE,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListCard<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        init,
        payer = seller,
        space = 8 + Listing::INIT_SPACE,
        seeds = [b"listing", card_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    
    #[account(
        mut,
        associated_token::mint = card_mint,
        associated_token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = seller,
        token::mint = card_mint,
        token::authority = marketplace,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyCard<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    #[account(mut)]
    pub seller: SystemAccount<'info>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        mut,
        close = seller,
        seeds = [b"listing", card_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = card_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = card_mint,
        associated_token::authority = marketplace,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(
        mut,
        seeds = [b"user_stats", seller.key().as_ref()],
        bump
    )]
    pub seller_stats: Account<'info, UserStats>,
    
    #[account(
        mut,
        seeds = [b"user_stats", buyer.key().as_ref()],
        bump
    )]
    pub buyer_stats: Account<'info, UserStats>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        mut,
        close = seller,
        seeds = [b"listing", card_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    
    #[account(
        mut,
        associated_token::mint = card_mint,
        associated_token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = card_mint,
        associated_token::authority = marketplace,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateAuction<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        init,
        payer = seller,
        space = 8 + Auction::INIT_SPACE,
        seeds = [b"auction", card_mint.key().as_ref()],
        bump
    )]
    pub auction: Account<'info, Auction>,
    
    #[account(
        mut,
        associated_token::mint = card_mint,
        associated_token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = seller,
        token::mint = card_mint,
        token::authority = marketplace,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"auction", card_mint.key().as_ref()],
        bump
    )]
    pub auction: Account<'info, Auction>,
    
    #[account(
        mut,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EndAuction<'info> {
    #[account(mut)]
    pub seller: SystemAccount<'info>,
    
    #[account(mut)]
    pub winner: SystemAccount<'info>,
    
    #[account(
        mut,
        close = seller,
        seeds = [b"auction", card_mint.key().as_ref()],
        bump
    )]
    pub auction: Account<'info, Auction>,
    
    #[account(
        mut,
        seeds = [b"pookie_card", card_mint.key().as_ref()],
        bump
    )]
    pub pookie_card: Account<'info, PookieCard>,
    
    #[account(
        init_if_needed,
        payer = winner,
        associated_token::mint = card_mint,
        associated_token::authority = winner,
    )]
    pub winner_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = card_mint,
        associated_token::authority = marketplace,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(
        mut,
        seeds = [b"user_stats", seller.key().as_ref()],
        bump
    )]
    pub seller_stats: Account<'info, UserStats>,
    
    #[account(
        mut,
        seeds = [b"user_stats", winner.key().as_ref()],
        bump
    )]
    pub winner_stats: Account<'info, UserStats>,
    
    pub card_mint: Box<Account<'info, anchor_spl::token::Mint>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_marketplace(ctx: Context<InitializeMarketplace>, fee_percentage: u16) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(fee_percentage <= 1000, ErrorCode::InvalidPrice); // Max 10%
    
    let marketplace = &mut ctx.accounts.marketplace;
    marketplace.authority = ctx.accounts.authority.key();
    marketplace.fee_percentage = fee_percentage;
    marketplace.total_volume = 0;
    marketplace.total_sales = 0;
    marketplace.created_at = clock.unix_timestamp;
    
    Ok(())
}

pub fn list_card(ctx: Context<ListCard>, price: u64) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(price > 0, ErrorCode::InvalidPrice);
    require!(
        ctx.accounts.pookie_card.owner == ctx.accounts.seller.key(),
        ErrorCode::NotCardOwner
    );
    require!(!ctx.accounts.pookie_card.is_listed, ErrorCode::AlreadyListed);
    
    // Transfer token to escrow
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.seller_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        },
    );
    
    transfer(cpi_ctx, 1)?;
    
    // Create listing
    let listing = &mut ctx.accounts.listing;
    listing.seller = ctx.accounts.seller.key();
    listing.mint = ctx.accounts.card_mint.key();
    listing.price = price;
    listing.created_at = clock.unix_timestamp;
    listing.is_active = true;
    
    // Update card status
    let pookie_card = &mut ctx.accounts.pookie_card;
    pookie_card.is_listed = true;
    pookie_card.listing_price = Some(price);
    
    Ok(())
}

pub fn buy_card(ctx: Context<BuyCard>) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(ctx.accounts.listing.is_active, ErrorCode::NotListed);
    require!(
        ctx.accounts.pookie_card.owner == ctx.accounts.listing.seller,
        ErrorCode::NotCardOwner
    );
    
    let price = ctx.accounts.listing.price;
    let fee = (price * ctx.accounts.marketplace.fee_percentage as u64) / 10000;
    let seller_amount = price - fee;
    
    // Transfer token from escrow to buyer
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ctx.accounts.marketplace.to_account_info(),
        },
    );
    
    transfer(cpi_ctx, 1)?;
    
    // Update card ownership
    let pookie_card = &mut ctx.accounts.pookie_card;
    pookie_card.owner = ctx.accounts.buyer.key();
    pookie_card.is_listed = false;
    pookie_card.listing_price = None;
    pookie_card.last_updated = clock.unix_timestamp;
    
    // Update marketplace stats
    let marketplace = &mut ctx.accounts.marketplace;
    marketplace.total_volume += price;
    marketplace.total_sales += 1;
    
    // Update user stats
    let seller_stats = &mut ctx.accounts.seller_stats;
    seller_stats.cards_owned -= 1;
    seller_stats.total_earned += seller_amount;
    seller_stats.last_activity = clock.unix_timestamp;
    
    let buyer_stats = &mut ctx.accounts.buyer_stats;
    buyer_stats.cards_owned += 1;
    buyer_stats.total_spent += price;
    buyer_stats.last_activity = clock.unix_timestamp;
    
    Ok(())
}

pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
    require!(
        ctx.accounts.pookie_card.owner == ctx.accounts.seller.key(),
        ErrorCode::NotCardOwner
    );
    require!(ctx.accounts.listing.is_active, ErrorCode::NotListed);
    
    // Transfer token back to seller
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.seller_token_account.to_account_info(),
            authority: ctx.accounts.marketplace.to_account_info(),
        },
    );
    
    transfer(cpi_ctx, 1)?;
    
    // Update card status
    let pookie_card = &mut ctx.accounts.pookie_card;
    pookie_card.is_listed = false;
    pookie_card.listing_price = None;
    
    Ok(())
}

pub fn create_auction(ctx: Context<CreateAuction>, starting_price: u64, duration: i64) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(starting_price > 0, ErrorCode::InvalidPrice);
    require!(duration > 0, ErrorCode::InvalidPrice);
    require!(
        ctx.accounts.pookie_card.owner == ctx.accounts.seller.key(),
        ErrorCode::NotCardOwner
    );
    require!(!ctx.accounts.pookie_card.is_listed, ErrorCode::AlreadyListed);
    
    // Transfer token to escrow
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.seller_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        },
    );
    
    transfer(cpi_ctx, 1)?;
    
    // Create auction
    let auction = &mut ctx.accounts.auction;
    auction.seller = ctx.accounts.seller.key();
    auction.mint = ctx.accounts.card_mint.key();
    auction.starting_price = starting_price;
    auction.current_bid = None;
    auction.current_bidder = None;
    auction.end_time = clock.unix_timestamp + duration;
    auction.created_at = clock.unix_timestamp;
    auction.is_active = true;
    
    // Update card status
    let pookie_card = &mut ctx.accounts.pookie_card;
    pookie_card.is_listed = true;
    pookie_card.listing_price = Some(starting_price);
    
    Ok(())
}

pub fn place_bid(ctx: Context<PlaceBid>, bid_amount: u64) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(ctx.accounts.auction.is_active, ErrorCode::AuctionNotActive);
    require!(clock.unix_timestamp < ctx.accounts.auction.end_time, ErrorCode::AuctionExpired);
    
    let min_bid = match ctx.accounts.auction.current_bid {
        Some(current_bid) => current_bid + (current_bid / 10), // 10% increment
        None => ctx.accounts.auction.starting_price,
    };
    
    require!(bid_amount >= min_bid, ErrorCode::BidTooLow);
    
    // Update auction
    let auction = &mut ctx.accounts.auction;
    auction.current_bid = Some(bid_amount);
    auction.current_bidder = Some(ctx.accounts.bidder.key());
    
    Ok(())
}

pub fn end_auction(ctx: Context<EndAuction>) -> Result<()> {
    let clock = Clock::get()?;
    
    require!(clock.unix_timestamp >= ctx.accounts.auction.end_time, ErrorCode::AuctionExpired);
    
    if let Some(final_bid) = ctx.accounts.auction.current_bid {
        if let Some(winner) = ctx.accounts.auction.current_bidder {
            require!(winner == ctx.accounts.winner.key(), ErrorCode::Unauthorized);
            
            let fee = (final_bid * ctx.accounts.marketplace.fee_percentage as u64) / 10000;
            let seller_amount = final_bid - fee;
            
            // Transfer token to winner
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.escrow_token_account.to_account_info(),
                    to: ctx.accounts.winner_token_account.to_account_info(),
                    authority: ctx.accounts.marketplace.to_account_info(),
                },
            );
            
            transfer(cpi_ctx, 1)?;
            
            // Update card ownership
            let pookie_card = &mut ctx.accounts.pookie_card;
            pookie_card.owner = ctx.accounts.winner.key();
            pookie_card.is_listed = false;
            pookie_card.listing_price = None;
            pookie_card.last_updated = clock.unix_timestamp;
            
            // Update marketplace stats
            let marketplace = &mut ctx.accounts.marketplace;
            marketplace.total_volume += final_bid;
            marketplace.total_sales += 1;
            
            // Update user stats
            let seller_stats = &mut ctx.accounts.seller_stats;
            seller_stats.cards_owned -= 1;
            seller_stats.total_earned += seller_amount;
            seller_stats.last_activity = clock.unix_timestamp;
            
            let winner_stats = &mut ctx.accounts.winner_stats;
            winner_stats.cards_owned += 1;
            winner_stats.total_spent += final_bid;
            winner_stats.last_activity = clock.unix_timestamp;
        }
    } else {
        // No bids, return to seller
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.seller_token_account.to_account_info(),
                authority: ctx.accounts.marketplace.to_account_info(),
            },
        );
        
        transfer(cpi_ctx, 1)?;
        
        // Update card status
        let pookie_card = &mut ctx.accounts.pookie_card;
        pookie_card.is_listed = false;
        pookie_card.listing_price = None;
    }
    
    Ok(())
}
