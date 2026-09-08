## Attribute
- value + type e.g green < - > color
## Product variant
- price, cost, stock and threshold
- linked to a single product
## Variant-attribute-value
- link varint to multiple attribute values e.g green + small < - > variant A
## Product Unit
- used in conversions for multiple storage units e.g box of 6 or pack of 12
- linked to product variant


# Mental Model: Multi-Product Catalog Architecture

This architecture demonstrates how **eight database tables** can represent fundamentally different product types—such as **dishes, clothing, electronics, and products sold using different units**—without changing the database schema or running migrations.

The architecture separates:

- **Products** → what customers see in the catalog
- **Product Variants** → specific sellable configurations
- **Attributes** → reusable characteristics such as Color, Size, or Material
- **Attribute Values** → possible values for those characteristics
- **Variant Attribute Values** → attributes assigned to a specific variant
- **Units** → reusable measurement or selling units
- **Product Units** → the units a product supports and their conversion rules

---

## 1. Catalog Level — `product`

> **Purpose:** The umbrella item displayed in the store catalog.

| `id` | `name` | `category` |
|:---|:---|:---|
| `prod-101` | **Plastic Dish** | Kitchenware |
| `prod-102` | **Classic Crewneck Tee** | Apparel |
| `prod-103` | **Fast Charge USB Cable** | Electronics |

A `product` represents the **catalog-level concept**, not necessarily a specific physical item.

```text
Product
│
├── Plastic Dish
├── Classic Crewneck Tee
└── Fast Charge USB Cable
```

---

## 2. Dynamic Attribute Registry — `attribute` & `attribute_value`

> **Purpose:** Define reusable characteristics and their possible values without adding new database columns.

### Attributes — `attribute`

| `id` | `name` |
|:---|:---|
| `attr-1` | **Color** |
| `attr-2` | **Size** |
| `attr-3` | **Material** |
| `attr-4` | **Length** |

### Attribute Values — `attribute_value`

| Attribute | Value ID | Value |
|:---|:---|:---|
| **Color** | `val-green` | Green |
| **Color** | `val-blue` | Blue |
| **Color** | `val-black` | Black |
| **Size** | `val-sml` | Small |
| **Size** | `val-lrg` | Large |
| **Size** | `val-xl` | XL |
| **Material** | `val-cot` | Cotton |
| **Material** | `val-mel` | Melamine |
| **Length** | `val-2m` | 2 Meters |

The attribute system can be extended with characteristics such as **Weight**, **Voltage**, **Capacity**, or **Dimensions** without modifying the database schema.

---

## 3. Physical Inventory Variants — `product_variant`

> **Purpose:** Represent specific sellable configurations that hold **SKU, pricing, and inventory**.

| `id` | `product_id` | `sku` | `cost_price` | `selling_price` | `stock_quantity` |
|:---|:---|:---|---:|---:|---:|
| `var-001` | `prod-101` | **DISH-GRN-SML** | $1.50 | $3.00 | **100 pcs** |
| `var-002` | `prod-101` | **DISH-BLU-LRG** | $2.50 | $5.00 | **50 pcs** |
| `var-003` | `prod-102` | **TEE-BLK-XL** | $8.00 | $25.00 | **45 pcs** |
| `var-004` | `prod-103` | **CAB-BLK-2M** | $3.00 | $12.00 | **200 pcs** |

A `product` is the **catalog item**.

A `product_variant` is the **specific sellable configuration**.

```text
Classic Crewneck Tee
        │
        └── TEE-BLK-XL
              ├── Color: Black
              ├── Size: XL
              └── Material: Cotton
```

The variant is where inventory and pricing belong because different variants can have different prices and stock levels.

---

## 4. Units — `unit`

> **Purpose:** Define reusable units of measurement or sale.

Units are global definitions that can be reused across many products.

| `id` | `name` |
|:---|:---|
| `unit-001` | **Piece** |
| `unit-002` | **Box** |
| `unit-003` | **Dozen** |
| `unit-004` | **Kilogram** |
| `unit-005` | **Meter** |
| `unit-006` | **Liter** |

The `unit` table only defines **what the unit is**.

It does not define how a particular product uses that unit.

---

## 5. Product Units — `product_unit`

> **Purpose:** Define which units a product supports and how those units convert to the product's base unit.

| `product_id` | `unit` | `conversion_factor` | `is_base_unit` |
|:---|:---|---:|:---:|
| `prod-101` | **Piece** | `1` | **Yes** |
| `prod-101` | **Box** | `12` | No |
| `prod-102` | **Piece** | `1` | **Yes** |
| `prod-103` | **Meter** | `1` | **Yes** |
| `prod-103` | **Roll** | `100` | No |

### Example

For the plastic dish:

```text
Plastic Dish
│
├── Piece
│   └── 1 Piece = 1 base unit
│
└── Box
    └── 1 Box = 12 Pieces
```

For the USB cable:

```text
USB Cable
│
├── Meter
│   └── 1 Meter = 1 base unit
│
└── Roll
    └── 1 Roll = 100 Meters
```

The `conversion_factor` expresses the quantity of the **base unit** represented by one unit of that type.

```text
1 Box = 12 Pieces
1 Dozen = 12 Pieces
1 Roll = 100 Meters
```

### Important Distinction

`unit` answers:

> **"What unit is this?"**

`product_unit` answers:

> **"How does this product use this unit?"**

For example:

```text
             unit
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
     Piece   Box    Dozen
       │      │      │
       └──────┼──────┘
              │
              ▼
        product_unit
              │
       ┌──────┴──────┐
       ▼             ▼
Plastic Dish     Another Product
1 Piece = 1      1 Box = 24
1 Box = 12       Pieces
```

---

## 6. Variant Trait Mapping — `variant_attribute_value`

> **Purpose:** Connect each physical variant to its specific combination of attribute values.

### `DISH-GRN-SML`

```text
DISH-GRN-SML
├── Color    → Green
│              (val-green)
└── Size     → Small
               (val-sml)
```

### `DISH-BLU-LRG`

```text
DISH-BLU-LRG
├── Color    → Blue
│              (val-blue)
└── Size     → Large
               (val-lrg)
```

### `TEE-BLK-XL`

```text
TEE-BLK-XL
├── Color    → Black
│              (val-black)
├── Size     → XL
│              (val-xl)
└── Material → Cotton
               (val-cot)
```

### `CAB-BLK-2M`

```text
CAB-BLK-2M
├── Color    → Black
│              (val-black)
└── Length   → 2 Meters
               (val-2m)
```

---

## 7. Complete Relationship

The architecture can be understood as:

```text
                         ┌──────────────┐
                         │   product    │
                         │              │
                         │ Plastic Dish │
                         │ Crewneck Tee │
                         │ USB Cable    │
                         └──────┬───────┘
                                │
                       ┌────────┴─────────┐
                       │                  │
                       │ 1:N              │ 1:N
                       ▼                  ▼
              ┌──────────────────┐   ┌────────────────┐
              │ product_variant  │   │  product_unit  │
              │                  │   │                │
              │ SKU              │   │ conversion     │
              │ Price            │   │ base unit      │
              │ Stock            │   │                │
              └────────┬─────────┘   └───────┬────────┘
                       │                     │
                       │                     │ N:1
                       │ N:M                 ▼
                       │               ┌──────────────┐
                       ▼               │     unit     │
          ┌────────────────────────┐   │              │
          │ variant_attribute_value│   │ Piece        │
          └────────────┬───────────┘   │ Box          │
                       │               │ Kilogram     │
                       │ N:1           │ Meter        │
                       ▼               └──────────────┘
             ┌─────────────────────┐
             │  attribute_value   │
             │                     │
             │ Green               │
             │ XL                  │
             │ Cotton              │
             │ 2 Meters            │
             └──────────┬──────────┘
                        │
                        │ N:1
                        ▼
                 ┌──────────────┐
                 │  attribute   │
                 │              │
                 │ Color        │
                 │ Size         │
                 │ Material     │
                 │ Length       │
                 └──────────────┘
```

---

## 8. How Everything Fits Together

A complete product can be viewed as:

```text
PRODUCT
│
│ "What is this?"
│
├─────────────────────────────┐
│                             │
▼                             ▼
PRODUCT VARIANTS          PRODUCT UNITS
│                             │
│ "Which version?"            │ "How is it sold/measured?"
│                             │
├── SKU                       ├── Piece
├── Price                     ├── Box
├── Stock                     └── Dozen
│
▼
VARIANT ATTRIBUTES
│
│ "What characteristics define it?"
│
├── Color
├── Size
└── Material
```

---

## 9. Example: A Product Sold in Multiple Units

Consider a product called **Rice**.

```text
Product
└── Rice
     │
     ├── Product Units
     │    ├── Kilogram → 1 kg
     │    ├── Bag      → 25 kg
     │    └── Carton   → 100 kg
     │
     └── Variants
          ├── RICE-WHT-5KG
          └── RICE-WHT-25KG
```

The unit relationship defines conversion:

```text
1 Kilogram = 1 base unit
1 Bag      = 25 Kilograms
1 Carton   = 100 Kilograms
```

This allows inventory calculations to operate against a consistent base unit.

For example:

```text
Stock = 100 Kilograms

Sell:
1 Bag = 25 Kilograms

Remaining:
100 - 25 = 75 Kilograms
```

The application can then display the inventory in whatever supported unit is appropriate.

---

## 10. Why This Architecture Works

The database schema does **not** need to change when introducing a new product type.

You can add:

- A **laptop** with RAM, storage, processor, and screen size
- A **shoe** with size, color, and material
- A **chair** with material, color, and dimensions
- A **phone** with storage, color, and RAM
- **Rice** sold by kilogram, bag, or carton
- **Cable** sold by meter or roll
- **Soda** sold by bottle, crate, or carton

without adding columns such as:

```text
shoe_size
ram
storage
screen_size
material
color
length
weight
capacity
```

Instead:

- Product characteristics become **attributes**
- Specific characteristics become **attribute values**
- Sellable configurations become **variants**
- Measurement/selling options become **units**
- Product-specific conversion rules become **product units**

> **The schema stays stable; the catalog becomes extensible through data.**

---

## 11. Core Design Principle

The architecture separates four different concerns:

| Concern | Table | Responsibility |
|:---|:---|:---|
| Catalog identity | `product` | What the product is |
| Sellable configuration | `product_variant` | Which specific version is sold |
| Product characteristics | `attribute` / `attribute_value` | What defines the product or variant |
| Measurement / selling | `unit` / `product_unit` | How the product is measured or sold |

This separation keeps the database flexible while keeping **inventory, product configuration, and unit conversion explicit and strongly structured**.