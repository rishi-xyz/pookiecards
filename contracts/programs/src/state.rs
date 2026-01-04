use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[account]
pub struct PookieCard {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub card_id: u64,
    pub name: String,
    pub rarity: CardRarity,
    pub element: CardElement,
    pub attack: u8,
    pub defense: u8,
    pub health: u8,
    pub special_ability: Option<String>,
    pub level: u8,
    pub experience: u32,
    pub created_at: i64,
    pub last_updated: i64,
    pub is_listed: bool,
    pub listing_price: Option<u64>,
}

impl PookieCard {
    pub const INIT_SPACE: usize = 32 + 32 + 8 + 4 + 1 + 1 + 1 + 1 + 1 + 4 + 1 + 4 + 8 + 8 + 1 + 9 + 100;
}

#[account]
pub struct Marketplace {
    pub authority: Pubkey,
    pub fee_percentage: u16, // basis points (100 = 1%)
    pub total_volume: u64,
    pub total_sales: u64,
    pub created_at: i64,
}

impl Marketplace {
    pub const INIT_SPACE: usize = 32 + 2 + 8 + 8 + 8;
}

#[account]
pub struct Listing {
    pub seller: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub created_at: i64,
    pub is_active: bool,
}

impl Listing {
    pub const INIT_SPACE: usize = 32 + 32 + 8 + 8 + 1;
}

#[account]
pub struct Auction {
    pub seller: Pubkey,
    pub mint: Pubkey,
    pub starting_price: u64,
    pub current_bid: Option<u64>,
    pub current_bidder: Option<Pubkey>,
    pub end_time: i64,
    pub created_at: i64,
    pub is_active: bool,
}

impl Auction {
    pub const INIT_SPACE: usize = 32 + 32 + 8 + 9 + 33 + 8 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CardRarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
    Mythic,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CardElement {
    Fire,
    Water,
    Earth,
    Air,
    Light,
    Dark,
    Neutral,
}

impl CardRarity {
    pub fn max_level(&self) -> u8 {
        match self {
            CardRarity::Common => 10,
            CardRarity::Uncommon => 15,
            CardRarity::Rare => 20,
            CardRarity::Epic => 25,
            CardRarity::Legendary => 30,
            CardRarity::Mythic => 40,
        }
    }

    pub fn base_stats(&self) -> (u8, u8, u8) {
        // (attack, defense, health)
        match self {
            CardRarity::Common => (3, 3, 10),
            CardRarity::Uncommon => (5, 5, 15),
            CardRarity::Rare => (8, 8, 20),
            CardRarity::Epic => (12, 12, 25),
            CardRarity::Legendary => (18, 18, 30),
            CardRarity::Mythic => (25, 25, 40),
        }
    }
}

impl CardElement {
    pub fn advantage_against(&self) -> Option<CardElement> {
        match self {
            CardElement::Fire => Some(CardElement::Earth),
            CardElement::Water => Some(CardElement::Fire),
            CardElement::Earth => Some(CardElement::Air),
            CardElement::Air => Some(CardElement::Water),
            CardElement::Light => Some(CardElement::Dark),
            CardElement::Dark => Some(CardElement::Light),
            CardElement::Neutral => None,
        }
    }

    pub fn disadvantage_against(&self) -> Option<CardElement> {
        match self {
            CardElement::Fire => Some(CardElement::Water),
            CardElement::Water => Some(CardElement::Air),
            CardElement::Earth => Some(CardElement::Fire),
            CardElement::Air => Some(CardElement::Earth),
            CardElement::Light => Some(CardElement::Dark),
            CardElement::Dark => Some(CardElement::Light),
            CardElement::Neutral => None,
        }
    }
}

#[account]
pub struct CardCollection {
    pub authority: Pubkey,
    pub name: String,
    pub description: String,
    pub total_cards: u64,
    pub max_supply: Option<u64>,
    pub created_at: i64,
    pub is_active: bool,
}

impl CardCollection {
    pub const INIT_SPACE: usize = 32 + 4 + 50 + 4 + 200 + 8 + 9 + 8 + 1;
}

#[account]
pub struct UserStats {
    pub owner: Pubkey,
    pub cards_owned: u64,
    pub cards_minted: u64,
    pub total_spent: u64,
    pub total_earned: u64,
    pub battles_won: u32,
    pub battles_lost: u32,
    pub experience: u64,
    pub level: u8,
    pub created_at: i64,
    pub last_activity: i64,
}

impl UserStats {
    pub const INIT_SPACE: usize = 32 + 8 + 8 + 8 + 8 + 4 + 4 + 8 + 1 + 8 + 8;
}