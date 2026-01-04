use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid card rarity")]
    InvalidRarity,
    #[msg("Invalid card element")]
    InvalidElement,
    #[msg("Card not found")]
    CardNotFound,
    #[msg("Not the card owner")]
    NotCardOwner,
    #[msg("Card already listed")]
    AlreadyListed,
    #[msg("Card not listed")]
    NotListed,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Invalid price")]
    InvalidPrice,
    #[msg("Auction not active")]
    AuctionNotActive,
    #[msg("Auction expired")]
    AuctionExpired,
    #[msg("Bid too low")]
    BidTooLow,
    #[msg("Cannot bid on own auction")]
    CannotBidOnOwnAuction,
    #[msg("Collection not found")]
    CollectionNotFound,
    #[msg("Max supply reached")]
    MaxSupplyReached,
    #[msg("Invalid level")]
    InvalidLevel,
    #[msg("Max level reached")]
    MaxLevelReached,
    #[msg("Insufficient experience")]
    InsufficientExperience,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Marketplace not initialized")]
    MarketplaceNotInitialized,
}
