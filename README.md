# 🛍️ Shop Profit Booster

### Complete Retail Intelligence System for Small Shops


## 📖 Overview

**Shop Profit Booster** is a lightweight, zero-cost web application that helps small retail shops (selling **clothes, tissues, and plastics**) make data-driven decisions. It answers the three most critical questions every shop owner asks:

1. **📦 WHAT SHOULD I RESTOCK?** - Identifies fast-moving, high-profit items
2. **💰 WHAT IS MAKING ME MONEY?** - Shows your top profit generators
3. **📉 WHAT AM I LOSING MONEY ON?** - Flags slow movers and low-margin products

Plus, it provides **smart bundling suggestions** to increase average order value at checkout.


## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **📊 Profit Analytics** | Real-time dashboard showing top performers and loss leaders |
| **📦 Restock Alerts** | Automatic notifications when stock falls below threshold |
| **💰 Profit Breakdown** | See exactly how much each product and category contributes |
| **📉 Loss Detection** | Identifies slow-moving inventory costing you storage space |
| **🎯 Smart Bundle Engine** | Suggests profitable combinations to increase basket size |
| **📱 Mobile-First** | Works perfectly on phones, tablets, and computers |
| **📋 Export Reports** | Download CSV reports for accounting or supplier orders |
| **🔔 Low Stock Warnings** | Color-coded inventory alerts (Green/Yellow/Red) |

---

## 🛠️ Technology Stack

```
┌─────────────────┬──────────────────────────┬─────────────────────┐
│ Layer           │ Technology               │ Cost                │
├─────────────────┼──────────────────────────┼─────────────────────┤
│ Frontend        │ HTML5 + CSS3 + Vanilla JS│ $0                  │
│ Backend         │ Node.js + Express         │ $0                  │
│ Database        │ SQLite                    │ $0                  │
│ Hosting         │ Render (Free Tier)        │ $0                  │
│ Charts          │ Chart.js (CDN)           │ $0                  │
└─────────────────┴──────────────────────────┴─────────────────────┘
```

**Total Monthly Cost: $0** (or $12/year for a custom domain)

---

## 📊 Core Analytics Dashboard

When you open the app, you see four key sections:

### 1. 📦 Restock Recommendations
```
┌─────────────────────────────────────────────────────────┐
│ 🔴 URGENT RESTOCK NEEDED                               │
│ ┌─────────────────────────────────────────────────────┐│
│ │ T-Shirts (Black)    Stock: 3    Sold: 47 (this week)││
│ │ Plastic Wrap (S)    Stock: 5    Sold: 38 (this week)││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ 🟡 ORDER SOON                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Designer Tissues    Stock: 12    Sold: 29 (this week)││
│ │ Jeans (Blue)        Stock: 8     Sold: 18 (this week)││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 2. 💰 Profit Leaders
```
┌─────────────────────────────────────────────────────────┐
│ 🏆 TOP PROFIT GENERATORS (This Month)                  │
│ ┌─────────────────────────────────────────────────────┐│
│ │ 1. Leather Jacket     $45.00 profit each            ││
│ │ 2. Premium Tissues    $2.50 profit per pack         ││
│ │ 3. Bulk Plastic Wrap  $3.50 profit per roll         ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ 📊 Category Breakdown                                   │
│ ┌─────────────────────────────────────────────────────┐│
│ │ ████████████░░░░  Clothes:    $1,240 (62%)         ││
│ │ ██████░░░░░░░░░░  Tissues:    $480  (24%)          ││
│ │ ████░░░░░░░░░░░░  Plastics:   $280  (14%)          ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 3. 📉 Loss Leaders (Items to Discount or Discontinue)
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ LOW PERFORMERS (Last 30 Days)                       │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Ties                  Sold: 2     Profit: $4.00     ││
│ │ Small Handkerchiefs   Sold: 1     Profit: $0.50     ││
│ │ Decorative Buttons    Sold: 0     Profit: $0.00     ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ 💡 SUGGESTION: Bundle ties with shirts to clear stock! │
└─────────────────────────────────────────────────────────┘
```

### 4. 📈 Sales Trends
```
┌─────────────────────────────────────────────────────────┐
│ 📈 DAILY SALES TREND (Last 7 Days)                     │
│ ┌─────────────────────────────────────────────────────┐│
│ │      │                                              ││
│ │  $400│    ██                                         ││
│ │  $300│  ██████     ████                              ││
│ │  $200│████████   ████████  ████                     ││
│ │  $100│██████████████████████████                     ││
│ │    $0└─────────────────────────────                 ││
│ │      Mon Tue Wed Thu Fri Sat Sun                    ││
│ └─────────────────────────────────────────────────────┘│
│ Best Day: Saturday ($387)  │  Worst Day: Monday ($124) │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema (Enhanced)

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT CHECK(category IN ('clothes','tissues','plastics')),
  cost_price REAL NOT NULL,
  selling_price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 10,      -- ⚠️ Alert threshold
  sold_count INTEGER DEFAULT 0,       -- Total sold (lifetime)
  last_restock_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Bundles Table
```sql
CREATE TABLE bundles (
  id INTEGER PRIMARY KEY,
  main_item_id INTEGER NOT NULL,
  addon_item_id INTEGER NOT NULL,
  bundle_price REAL NOT NULL,
  discount REAL DEFAULT 0,
  times_sold INTEGER DEFAULT 0,      -- Track popularity
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY(main_item_id) REFERENCES products(id),
  FOREIGN KEY(addon_item_id) REFERENCES products(id)
);
```

### Sales Log Table
```sql
CREATE TABLE sales_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,                 -- NULL if bundle sale
  bundle_id INTEGER,                  -- NULL if single item
  quantity INTEGER DEFAULT 1,
  unit_price REAL NOT NULL,
  total_revenue REAL NOT NULL,
  cost_of_goods REAL NOT NULL,
  profit REAL NOT NULL,
  sale_type TEXT CHECK(sale_type IN ('single','bundle')),
  sold_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  staff_name TEXT,
  FOREIGN KEY(product_id) REFERENCES products(id),
  FOREIGN KEY(bundle_id) REFERENCES bundles(id)
);
```

### Inventory Audit Table (Tracks Changes)
```sql
CREATE TABLE inventory_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  old_stock INTEGER,
  new_stock INTEGER,
  change_type TEXT CHECK(change_type IN ('sale','restock','adjustment')),
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

---

## 📁 Project Structure

```
shop-profit-booster/
│
├── src/
│   ├── public/
│   │   ├── index.html          # Main dashboard UI
│   │   ├── style.css           # Responsive styles
│   │   └── script.js           # Frontend logic & charts
│   │
│   ├── server.js               # Express server & API routes
│   ├── database.js             # Database queries (CRUD + Analytics)
│   ├── analytics.js            # 📊 ALL ANALYTICS LOGIC
│   ├── seed.js                 # Seed script with realistic data
│   └── restock-engine.js       # 🔄 Restock recommendation engine
│
├── database.sqlite             # SQLite database
├── package.json
├── .env.example
└── README.md
```

---

## 🔌 API Endpoints (Full Analytics)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/restock` | **WHAT TO RESTOCK** - Items below threshold, sorted by urgency |
| `GET` | `/api/analytics/profit-leaders` | **WHAT MAKES MONEY** - Top products by profit contribution |
| `GET` | `/api/analytics/loss-leaders` | **WHAT LOSES MONEY** - Low sales, low margin, or high storage cost |
| `GET` | `/api/analytics/category-breakdown` | Profit by category (clothes/tissues/plastics) |
| `GET` | `/api/analytics/daily-trends` | Last 7/30/90 day sales trends |
| `GET` | `/api/analytics/inventory-value` | Total inventory value and turnover rate |
| `GET` | `/api/analytics/bundle-performance` | Which bundles sell best? |
| `POST` | `/api/inventory/restock` | Log a restock event (updates stock + audit) |
| `GET` | `/api/reports/export` | Download CSV with all analytics |

---

## 📊 Analytics Logic (The Intelligence Layer)

### 1. Restock Recommendation Algorithm

```javascript
function getRestockRecommendations() {
  // Priority: Items with stock <= min_stock sorted by sales velocity
  const items = db.query(`
    SELECT 
      p.*,
      (SELECT COUNT(*) FROM sales_log 
       WHERE product_id = p.id 
       AND sold_at > datetime('now', '-7 days')) as weekly_sales,
      (p.selling_price - p.cost_price) as margin
    FROM products p
    WHERE p.stock <= p.min_stock
    ORDER BY weekly_sales DESC, margin DESC
  `);
  
  return {
    urgent: items.filter(i => i.stock < i.min_stock * 0.3),
    soon: items.filter(i => i.stock >= i.min_stock * 0.3)
  };
}
```

### 2. Profit Leaders Calculation

```javascript
function getProfitLeaders(period = '30 days') {
  return db.query(`
    SELECT 
      p.name,
      p.category,
      SUM(s.total_revenue) as revenue,
      SUM(s.profit) as total_profit,
      COUNT(s.id) as units_sold,
      AVG(s.profit) as avg_profit_per_unit
    FROM sales_log s
    JOIN products p ON s.product_id = p.id
    WHERE s.sold_at > datetime('now', ?)
    GROUP BY p.id
    ORDER BY total_profit DESC
    LIMIT 10
  `, [`-${period}`]);
}
```

### 3. Loss Leaders Detection

```javascript
function getLossLeaders() {
  // Items with high cost, low sales, or negative margin
  return db.query(`
    SELECT 
      p.name,
      p.category,
      p.stock,
      (SELECT COUNT(*) FROM sales_log 
       WHERE product_id = p.id 
       AND sold_at > datetime('now', '-30 days')) as sales_30d,
      (p.selling_price - p.cost_price) as margin,
      CASE 
        WHEN (p.selling_price - p.cost_price) < 2 THEN '⚠️ Low Margin'
        WHEN (SELECT COUNT(*) FROM sales_log 
              WHERE product_id = p.id 
              AND sold_at > datetime('now', '-30 days')) < 3 THEN '⚠️ Slow Moving'
        ELSE '✅ Good'
      END as status
    FROM products p
    WHERE p.stock > 0
    HAVING status != '✅'
    ORDER BY margin ASC, sales_30d ASC
  `);
}
```

### 4. Inventory Turnover Rate

```javascript
function getInventoryTurnover() {
  // How fast inventory sells (higher = better)
  return db.query(`
    SELECT 
      category,
      AVG(stock) as avg_stock,
      SUM(sold_count) as total_sold,
      ROUND(SUM(sold_count) * 1.0 / AVG(stock), 2) as turnover_rate
    FROM products
    GROUP BY category
    ORDER BY turnover_rate DESC
  `);
}
```

---

## 📱 Usage Guide

### For Shop Owners - The Analytics Dashboard

1. **Open the app** → See the main dashboard
2. **Check "Restock Now"** section first:
   - 🔴 Red = Order immediately
   - 🟡 Yellow = Order soon
   - 🟢 Green = Stock is healthy
3. **Review "Profit Leaders"** to know which products to promote
4. **Check "Loss Leaders"** to decide:
   - Markdown pricing to clear stock
   - Bundle with high-sellers
   - Discontinue if unsalvageable
5. **Export Monthly Report** for accounting/suppliers

### For Cashiers - Daily Operations

1. **Ring up a sale** → Log in the app
2. **View suggested bundles** based on what's selling well
3. **Check stock alerts** before telling customers "we're out"
4. **End of day** → Review the day's profit in the dashboard

---

## 🎯 Business Intelligence: Real Example

After 30 days of using the app, the dashboard shows:

### 📦 Restock Priority
| Item | Stock | Sold/Week | Status |
| :--- | :--- | :--- | :--- |
| T-Shirts (White) | 4 | 25 | 🔴 URGENT |
| Plastic Wrap (L) | 8 | 18 | 🔴 URGENT |
| Designer Tissues | 15 | 12 | 🟡 Order Soon |

### 💰 Profit Leaders
| Item | Profit/Unit | Units Sold | Total Profit |
| :--- | :--- | :--- | :--- |
| Leather Jacket | $45.00 | 12 | $540 |
| T-Shirts (White) | $12.00 | 25 | $300 |
| Premium Tissues | $2.50 | 40 | $100 |

### 📉 Loss Leaders
| Item | Sales/Month | Profit/Unit | Action |
| :--- | :--- | :--- | :--- |
| Ties | 2 | $4.00 | ⚠️ Bundle with shirts |
| Handkerchiefs | 1 | $0.50 | ⚠️ Discontinue |

### 💡 AI-Generated Recommendations
```
📌 Based on your data:
1. Order 50 white T-shirts and 30 large plastic wraps TODAY
2. Create bundle: "Buy a Tie + Get 2 Handkerchiefs for $1"
3. You're losing $120/month on unsold handkerchiefs - run a clearance sale
```

---

## 🚀 Deployment

### Deploy to Render (Free - Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add full analytics dashboard"
   git push origin main
   ```

2. **Sign up at** [Render.com](https://render.com)

3. **Create Web Service**
   - Connect your GitHub repository
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add `PORT=10000`

4. **Access** your app at `https://your-app.onrender.com`

5. **Generate QR Code** for cashiers to access instantly

---

## 🧪 Sample Data

The seed script creates 15 realistic products:

```javascript
// 5 Clothes Items
{ name: "T-Shirt (White)", category: "clothes", cost: 8, sell: 20, stock: 50 }
{ name: "T-Shirt (Black)", category: "clothes", cost: 8, sell: 20, stock: 30 }
{ name: "Jeans (Blue)", category: "clothes", cost: 20, sell: 45, stock: 20 }
{ name: "Leather Jacket", category: "clothes", cost: 55, sell: 100, stock: 8 }
{ name: "Tie (Silk)", category: "clothes", cost: 8, sell: 15, stock: 12 }

// 5 Tissue Items
{ name: "Designer Tissues", category: "tissues", cost: 0.5, sell: 3, stock: 100 }
{ name: "Economy Tissues", category: "tissues", cost: 0.2, sell: 1, stock: 200 }
{ name: "Premium Tissues", category: "tissues", cost: 1, sell: 4.5, stock: 60 }
{ name: "Handkerchiefs", category: "tissues", cost: 1.5, sell: 2.5, stock: 15 }
{ name: "Paper Napkins", category: "tissues", cost: 0.3, sell: 1.2, stock: 80 }

// 5 Plastic Items
{ name: "Plastic Wrap (S)", category: "plastics", cost: 0.5, sell: 2, stock: 40 }
{ name: "Plastic Wrap (L)", category: "plastics", cost: 1, sell: 4.5, stock: 25 }
{ name: "Garbage Bags (20pk)", category: "plastics", cost: 1.5, sell: 5, stock: 35 }
{ name: "Storage Containers", category: "plastics", cost: 2, sell: 6, stock: 18 }
{ name: "Zip Bags (100pk)", category: "plastics", cost: 1.2, sell: 3.5, stock: 45 }
```

---

## 🛠️ Customization

### Change Restock Thresholds

Edit `src/analytics.js`:
```javascript
const THRESHOLDS = {
  URGENT: 0.3,      // 30% of min_stock = red alert
  WARNING: 0.6,     // 60% of min_stock = yellow alert
  MIN_STOCK: 10     // Default min_stock for new products
};
```

### Add New Categories

Update the database schema:
```sql
category TEXT CHECK(category IN ('clothes','tissues','plastics','electronics','food','accessories'))
```

### Customize Report Periods

Add dropdown options in `index.html`:
```html
<select id="reportPeriod">
  <option value="7">Last 7 Days</option>
  <option value="30" selected>Last 30 Days</option>
  <option value="90">Last 90 Days</option>
  <option value="365">Last Year</option>
</select>
```

---

## 📊 Dashboard Widgets (Visualization)

The app includes Chart.js for data visualization:

```javascript
// Profit by Category (Pie Chart)
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Clothes', 'Tissues', 'Plastics'],
    datasets: [{
      data: [1240, 480, 280],
      backgroundColor: ['#3498db', '#2ecc71', '#f39c12']
    }]
  }
});

// Sales Trend (Line Chart)
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Daily Sales',
      data: [124, 156, 198, 243, 287, 387, 245],
      borderColor: '#2c3e50'
    }]
  }
});
```

---

## 🔄 CI/CD & Maintenance

### Automatic Updates
- Push to GitHub → Render auto-deploys
- No manual server management needed

### Daily Backups
```bash
# Add to your server's cron job
0 2 * * * cp /app/database.sqlite /backups/db_$(date +\%Y\%m\%d).sqlite
```

### Performance Optimization
- SQLite is fast for < 100,000 sales
- Index frequently queried columns:
```sql
CREATE INDEX idx_sales_product ON sales_log(product_id);
CREATE INDEX idx_sales_date ON sales_log(sold_at);
```

---

## 📄 License

**MIT License** - Free for personal and commercial use.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/yourusername/shop-profit-booster.git
cd shop-profit-booster

# Install
npm install

# Initialize
npm run init-db
npm run seed

# Run
npm start

# Open
http://localhost:3000
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/analytics`)
3. Commit changes (`git commit -m "Add inventory turnover metric"`)
4. Push (`git push origin feature/analytics`)
5. Open Pull Request

---

**Built with ❤️ for small business owners everywhere.**  
**Stop guessing. Start knowing. 📊**