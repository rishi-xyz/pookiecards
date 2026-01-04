pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Fy2kUdeX979xZKx4RtZjwTU1dfPngr1rDg21sHzeQvpa");

#[program]
pub mod programs {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
    
    pub fn initialize_user_stats(ctx: Context<InitializeUserStats>) -> Result<()> {
        initialize_user_stats(ctx)
    }
    
    pub fn initialize_marketplace(ctx: Context<InitializeMarketplace>, fee_percentage: u16) -> Result<()> {
        initialize_marketplace(ctx, fee_percentage)
    }
    
    pub fn mint_card(
        ctx: Context<MintCard>,
        card_id: u64,
        name: String,
        rarity: CardRarity,
        element: CardElement,
    ) -> Result<()> {
        handler(ctx, card_id, name, rarity, element)
    }
    
    pub fn transfer_card(ctx: Context<TransferCard>) -> Result<()> {
        transfer_card(ctx)
    }
    
    pub fn level_up_card(ctx: Context<LevelUpCard>) -> Result<()> {
        level_up_card(ctx)
    }
    
    pub fn add_experience(ctx: Context<AddExperience>, amount: u32) -> Result<()> {
        add_experience(ctx, amount)
    }
    
    pub fn update_card_stats(
        ctx: Context<UpdateCardStats>,
        new_attack: Option<u8>,
        new_defense: Option<u8>,
        new_health: Option<u8>,
        new_special_ability: Option<Option<String>>,
    ) -> Result<()> {
        update_card_stats(ctx, new_attack, new_defense, new_health, new_special_ability)
    }
    
    pub fn create_collection(
        ctx: Context<CreateCollection>,
        name: String,
        description: String,
        max_supply: Option<u64>,
    ) -> Result<()> {
        create_collection(ctx, name, description, max_supply)
    }
    
    pub fn list_card(ctx: Context<ListCard>, price: u64) -> Result<()> {
        list_card(ctx, price)
    }
    
    pub fn buy_card(ctx: Context<BuyCard>) -> Result<()> {
        buy_card(ctx)
    }
    
    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        cancel_listing(ctx)
    }
    
    pub fn create_auction(ctx: Context<CreateAuction>, starting_price: u64, duration: i64) -> Result<()> {
        create_auction(ctx, starting_price, duration)
    }
    
    pub fn place_bid(ctx: Context<PlaceBid>, bid_amount: u64) -> Result<()> {
        place_bid(ctx, bid_amount)
    }
    
    pub fn end_auction(ctx: Context<EndAuction>) -> Result<()> {
        end_auction(ctx)
    }
}
