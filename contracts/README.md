# PookieCards NFT Smart Contracts

A comprehensive Solana smart contract system for PookieCards NFT trading game built with Anchor framework.

## Features

### Core NFT Functionality
- **Card Minting**: Create unique PookieCard NFTs with metadata
- **Card Attributes**: Each card has rarity, element, stats (attack/defense/health), and special abilities
- **Level System**: Cards can level up and gain experience
- **Collections**: Organize cards into collections with supply limits

### Marketplace Features
- **Direct Sales**: List cards for fixed prices
- **Auctions**: Time-based bidding system
- **Escrow System**: Secure token holding during transactions
- **Fee Structure**: Configurable marketplace fees

### Card Management
- **Transfer**: Send cards between users
- **Experience & Leveling**: Add experience and level up cards
- **Stats Updates**: Modify card attributes
- **User Statistics**: Track user activity and progress

## Card System

### Rarity Tiers
- Common (Level 10 max)
- Uncommon (Level 15 max)
- Rare (Level 20 max)
- Epic (Level 25 max)
- Legendary (Level 30 max)
- Mythic (Level 40 max)

### Elements
- Fire, Water, Earth, Air (with advantage/disadvantage system)
- Light, Dark (opposing elements)
- Neutral (no advantages/disadvantages)

### Base Stats by Rarity
- Common: 3 ATK / 3 DEF / 10 HP
- Uncommon: 5 ATK / 5 DEF / 15 HP
- Rare: 8 ATK / 8 DEF / 20 HP
- Epic: 12 ATK / 12 DEF / 25 HP
- Legendary: 18 ATK / 18 DEF / 30 HP
- Mythic: 25 ATK / 25 DEF / 40 HP

## Contract Structure

### Accounts
- `PookieCard`: Main card data structure
- `Marketplace`: Marketplace configuration and stats
- `Listing`: Fixed-price sale listings
- `Auction`: Auction data and bidding
- `CardCollection`: Collection management
- `UserStats`: User activity tracking

### Instructions
- `mint_card`: Create new PookieCard NFTs
- `transfer_card`: Transfer ownership
- `level_up_card`: Level up cards with experience
- `add_experience`: Add experience to cards
- `list_card`: List for fixed-price sale
- `buy_card`: Purchase listed cards
- `cancel_listing`: Remove from marketplace
- `create_auction`: Start new auction
- `place_bid`: Bid on auctions
- `end_auction`: Complete auction

## Installation & Setup

1. Install dependencies:
```bash
yarn install
```

2. Build the program:
```bash
anchor build
```

3. Run tests:
```bash
anchor test
```

4. Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

## Usage Examples

### Initialize Marketplace
```typescript
await program.methods
  .initializeMarketplace(500) // 5% fee
  .accounts({
    marketplace: marketplacePda,
    authority: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Mint a Card
```typescript
await program.methods
  .mintCard(
    new BN(1), // cardId
    "Fire Dragon", // name
    { legendary: {} }, // rarity
    { fire: {} } // element
  )
  .accounts({
    // ... required accounts
  })
  .rpc();
```

### List for Sale
```typescript
await program.methods
  .listCard(new BN(1_000_000_000)) // 1 SOL
  .accounts({
    // ... required accounts
  })
  .rpc();
```

### Create Auction
```typescript
await program.methods
  .createAuction(
    new BN(500_000_000), // starting price 0.5 SOL
    new BN(86400) // 24 hours duration
  )
  .accounts({
    // ... required accounts
  })
  .rpc();
```

## Security Features

- **Ownership Validation**: Only card owners can transfer/sell
- **Listing Protection**: Cards can't be listed multiple times
- **Bid Validation**: Minimum bid increments enforced
- **Escrow Security**: Tokens held securely during transactions
- **Auction Timing**: Automatic auction expiration
- **Fee Collection**: Marketplace fees automatically deducted

## Metadata Structure

Each card includes on-chain metadata:
- Name and description
- Rarity and element type
- Combat stats (attack/defense/health)
- Level and experience
- Special abilities
- Creation timestamps

Off-chain metadata URI format:
```
https://api.pookiecards.com/metadata/{cardId}
```

## Testing

The test suite covers:
- Card minting and metadata creation
- Marketplace listings and purchases
- Auction creation and bidding
- Card leveling and experience
- Error handling and edge cases

Run tests with:
```bash
anchor test
```

## Development

### Adding New Features
1. Define new account structures in `state.rs`
2. Add instructions in appropriate instruction file
3. Update `lib.rs` with new program methods
4. Add comprehensive tests

### Modifying Card Stats
Update base stats in `CardRarity::base_stats()` method in `state.rs`.

### Changing Fee Structure
Modify fee calculations in marketplace instructions.

## License

MIT License - see LICENSE file for details.
