# **FarmIt: Game Design Document (GDD)**

---

## **1. Game Overview**

### **Title**

FarmIt

### **Genre**

2D Farming Simulation with Social and Economic Mechanics

### **Platform**

Web-based game, accessible via modern browsers.

### **Summary**

In FarmIt, players step into the boots of a farmer, managing land, growing
crops, and building a thriving virtual farm. They can trade with other players,
buy and sell resources, participate in auctions, and craft unique items. The
game combines strategy, resource management, and social interaction, offering
endless fun and growth opportunities.

---

## **2. Core Game Mechanics**

### **2.1 Farming**

#### **Land Plots**

- **Grid System**:

  - The farm operates on a grid system where each cell represents a plot of
    land.

  - Initially, players start with a 4x4 grid, with opportunities to expand
    incrementally by purchasing additional land using in-game currency.

  - Land expansion introduces strategic planning as players decide between
    maximizing crop yield or creating space for buildings and decorations.

#### **Crops**

- **Crop Varieties**:

  - A diverse range of crops is available, categorized into common, rare, and
    seasonal crops.

  - Each crop has unique properties:

    - Growth time (e.g., Wheat: 2 hours; Rare Herbs: 8 hours).

    - Market value (e.g., Wheat: Low; Rare Herbs: High).

    - Resource requirements (e.g., water, fertilizer).

- **Fertilizers**:

  - Enhance growth speed or improve crop quality.

- **Seasonal Influence**:

  - Crops grow best in their corresponding seasons. Off-season growth is slower
    and requires additional resources.

#### **Dynamic Weather**

- Weather impacts farming outcomes:

  - Rain: Eliminates the need for manual watering, speeding up growth.

  - Drought: Increases water requirements.

  - Storms: Risk of crop damage, mitigated by resilient soil potions or
    protective measures.

#### **Maintenance**

- Players must water crops, apply fertilizers, and protect them from pests or
  weather conditions. Failure to maintain crops can lead to reduced yields or
  crop destruction.

### **2.2 Inventory Management**

#### **Capacity**

- The initial inventory has limited slots, encouraging players to prioritize
  their resources.

- **Upgrade System**:

  - Use coins to expand storage capacity incrementally.

#### **Item Categories**

- **Crops**: Harvested produce, stored for trade, crafting, or sale.

- **Seeds**: Used to plant new crops, purchasable or obtainable through rewards.

- **Tools**: Essential for farming tasks (e.g., watering cans, scythes).

- **Potions**: Special consumables that provide boosts or protect crops.

### **2.3 Plot Potions**

- **Types of Potions**:

  - **Instant Grow Potion**: Accelerates crop growth instantly.

  - **Double Yield Potion**: Doubles the harvest from a plot.

  - **Extended Growth Potion**: Prolongs crop lifespan to prevent expiration.

  - **Resilient Soil Potion**: Protects crops from weather-related damage.

### **2.4 Crop Expiration**

- Crops become perishable once fully grown.

  - **Harvest Window**:

    - Players have a set time to harvest before crops expire (e.g., 24 hours).

  - Expired crops are destroyed, resulting in a loss of resources and
    investment.

- **Prevention**:

  - Extended Growth Potions or automated harvesters can mitigate losses.

### **2.5 Trading and Economy**

#### **NPC Shops**

- Provide basic items like seeds, fertilizers, and tools at fixed prices.

- Offers daily deals or limited-time items.

#### **Player Marketplace**

- A live economy system where players list items for sale.

- **Dynamic Pricing**:

  - Supply and demand dictate market value.

  - Players can undercut competitors or hold out for higher prices.

#### **Auctions**

- Rare or valuable items are auctioned to the highest bidder.

- Players can bid against each other in real-time.

### **2.6 Crafting and Building**

#### **Crafting**

- Combine resources to produce:

  - **Tools**: Scythes, watering cans, or advanced machinery.

  - **Consumables**: Fertilizers or potions.

#### **Building**

- Expand the farm by constructing:

  - Barns for storage.

  - Greenhouses to grow out-of-season crops.

  - Irrigation systems for automated watering.

### **2.7 Currency**

- **Coins**:

  - Earned from selling crops and completing missions.

  - Used for purchases and upgrades.

- **Premium Currency**:

  - Optional purchases for exclusive items or fast-tracking progress.

### **2.8 Social Features**

#### **Friends System**

- Add friends, visit their farms, and trade resources directly.

#### **Leaderboards**

- Compete globally or locally in categories like:

  - Most crops harvested.

  - Highest earnings.

#### **Cooperative Challenges**

- Group tasks that require collaboration to achieve large-scale objectives.

---

## **3. Advanced Gameplay Features**

### **3.1 Seasonal Events**

- Limited-time activities tied to real-world seasons.

- Example: Halloween introduces exclusive pumpkin crops and themed rewards.

### **3.2 Competitions**

- Weekly or monthly challenges with varying themes.

- Rewards include rare seeds, potions, or unique decorations.

### **3.3 Automation**

- Unlock advanced tools:

  - **Sprinklers**: Automate watering.

  - **Harvesters**: Collect crops automatically.

  - **Drones**: Monitor and manage large farms.

### **3.4 Dynamic Goals**

- Special missions, e.g., "Deliver 500 units of wheat in 48 hours," with
  generous rewards.

---

## **4. Visual and Audio Design**

### **4.1 Art Style**

- Whimsical 2D pixel art with vibrant colors.

### **4.2 Audio**

- Relaxing, ambient countryside music.

- Unique sound effects for each farming action.

### **4.3 UI/UX**

- Simple, drag-and-drop mechanics for intuitive gameplay.

---

## **5. Game Loop**

1. Plant seeds.

2. Water and maintain crops.

3. Harvest and trade.

4. Reinvest in farm growth.

---

## **6. Technical Design**

### **6.1 Frontend**

- **Framework**: React.js or Vue.js for responsive UI.

- **Rendering**: Phaser.js for efficient and interactive 2D visuals.

### **6.2 Backend**

- **Framework**: Deno (TypeScript).

- **Database**: PostgreSQL to handle:

  - Player data.

  - Inventory and trading logs.

  - Real-time marketplace.

### **6.3 Multiplayer and Social**

- **Real-Time Interactions**:

  - WebSocket for live marketplace and auctions.

- **Authentication**:

  - OAuth2 or Firebase for secure user logins.

### **6.4 Time Synchronization**

- **Server Time Authority**:

  - The server acts as the authoritative source for time, ensuring consistent
    crop growth and expiration times across players.

- **Implementation**:

  - Clients fetch the server time upon login and periodically synchronize via
    lightweight API calls.

  - All time-sensitive operations (e.g., crop growth, auctions) rely on
    server-side timestamps to prevent exploitation.

- **Compensation for Latency**:

  - Small buffer windows ensure seamless gameplay even with minor latency.

---

## **7. Roadmap**

### **Phase 1: Core Mechanics**

1. Develop the farming grid system.

2. Implement planting, growth, and harvesting mechanics.

3. Design basic inventory and storage management.

### **Phase 2: Trading and Economy**

1. Create NPC shops with basic functionality.

2. Introduce the player marketplace with dynamic pricing.

3. Add auction mechanics for rare items.

### **Phase 3: Social Features**

1. Build the friends system and leaderboard integration.

2. Implement cooperative challenges.

### **Phase 4: Advanced Features**

1. Introduce crafting and potion systems.

2. Develop seasonal events and competitions.

3. Add automation tools like sprinklers and drones.

---

## **8. Monetization Strategy**

- Offer exclusive cosmetic items and optional premium currency.

- Non-intrusive ads for optional rewards.
