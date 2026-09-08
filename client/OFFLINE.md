# Offline First Architecture

This document describes the offline first architecture used by Dukatiq.

The goal is to allow the application to function with or without an internet connection while keeping PostgreSQL as the source of truth.

---

# Principles

The application is built around these principles:

* Local First
* Eventual Consistency
* Repository Pattern
* Service Layer
* Background Synchronization
* Server as Source of Truth

The UI should never depend directly on network availability.

---

# Architecture

```text
                 React UI
                     │
                     ▼
            Feature Services
                     │
                     ▼
              Repositories
                     │
                     ▼
          IndexedDB (Dexie)
                     │
             Local Transactions
                     │
                     ▼
               Sync Queue
                     │
                     ▼
             Background Sync
                     │
                     ▼
          Express + Drizzle API
                     │
                     ▼
                PostgreSQL
```

---

# Folder Structure

```
src/
├── app/
├── routes/
├── features/
│
├── data/
│   ├── db/
│   │   ├── dexie.ts
│   │   ├── schema.ts
│   │   └── migrations.ts
│   │
│   ├── repositories/
│   │   ├── product.repository.ts
│   │   ├── sale.repository.ts
│   │   ├── inventory.repository.ts
│   │   └── customer.repository.ts
│   │
│   ├── queue/
│   │   └── sync.repository.ts
│   │
│   └── sync/
│       ├── sync.service.ts
│       ├── upload.ts
│       ├── download.ts
│       ├── conflict.ts
│       └── connectivity.ts
│
├── network/
│   ├── client.ts
│   ├── auth.ts
│   └── interceptors.ts
│
├── components/
├── hooks/
├── store/
├── types/
└── utils/
```

---

# Responsibilities

## Features

Features contain:

* Components
* Hooks
* Services
* Types
* Utilities

Features never communicate directly with the API.

Example

```
features/

products/

sales/

customers/

inventory/
```

---

## Services

Services contain business logic.

Examples

```
Create Sale

Update Product

Receive Inventory

Refund Sale
```

A service coordinates repositories.

```
SaleService

↓

SaleRepository

↓

IndexedDB
```

Services never communicate directly with Express.

---

## Repositories

Repositories are responsible for persistence.

Example

```
ProductRepository
```

Methods

```
getAll()

getById()

create()

update()

delete()
```

Repositories only communicate with IndexedDB.

---

## IndexedDB

Dexie is used as the local database.

Responsibilities

* Products
* Inventory
* Customers
* Sales
* Expenses
* Settings
* Sync Queue

The UI always reads from IndexedDB.

---

## Sync Queue

Every mutation creates a sync event.

Example

```
sync_queue

id

entity

entityId

operation

status

createdAt
```

The queue does not duplicate entire payloads.

Instead

```
Product Updated

↓

Queue

↓

Read latest Product

↓

Generate payload

↓

Upload
```

---

# Transaction Flow

Every mutation is atomic.

```
BEGIN

Save Entity

Create Queue Entry

COMMIT
```

If either operation fails

```
ROLLBACK
```

This prevents data inconsistencies.

---

# Product Creation

```
User

↓

Product Form

↓

ProductService

↓

ProductRepository

↓

IndexedDB

↓

Sync Queue

↓

React Query Refresh
```

The network is not involved.

---

# Reading Data

```
React Query

↓

Repository

↓

IndexedDB
```

The UI never waits for the API.

---

# Synchronization

Synchronization runs independently.

Triggers

* Application startup
* User login
* Internet restored
* Manual sync
* Periodic background sync

Flow

```
Pending Queue

↓

Upload

↓

Server Validation

↓

Database Commit

↓

Download Changes

↓

Update IndexedDB

↓

Remove Queue Item
```

---

# Synchronization API

Instead of dozens of endpoints

```
GET /products

GET /customers

GET /sales
```

Expose synchronization endpoints.

Upload

```
POST /sync/upload
```

Example

```json
{
  "changes": [
    {
      "entity": "product",
      "operation": "UPDATE",
      "id": "uuid"
    }
  ]
}
```

Download

```
GET /sync/download?cursor=15420
```

Response

```json
{
  "cursor": 15450,
  "changes": []
}
```

---

# Synchronization Strategy

The application uses incremental synchronization.

The first login downloads all required store data.

Subsequent synchronizations only download changes after the client's current cursor.

Advantages

* Small payloads
* Faster synchronization
* Lower bandwidth usage

---

# Entity Metadata

Every synchronized table should contain

```
id

version

updatedAt

deletedAt
```

Purpose

* Conflict detection
* Incremental synchronization
* Soft deletes

---

# Conflict Resolution

Different entities require different strategies.

| Entity | Strategy |
|----------|-----------|
| Products | Last Write Wins |
| Customers | Last Write Wins |
| Settings | Version Check |
| Inventory | Inventory Movements |
| Sales | Append Only |
| Payments | Append Only |

---

# Inventory

Never synchronize stock quantity directly.

Instead synchronize inventory movements.

Example

```
Purchase +100

Sale -2

Damage -1

Adjustment +5
```

Current stock

```
SUM(all inventory movements)
```

This significantly reduces synchronization conflicts.

---

# Authentication

Online

```
User

↓

Express

↓

JWT

↓

Refresh Token

↓

Local Session
```

Offline

```
PIN

↓

Local Validation

↓

Unlock Application
```

Offline authentication never contacts the server.

---

# Service Worker

The Service Worker caches only application assets.

Cached

* HTML
* JavaScript
* CSS
* Fonts
* Images

Not Cached

* API Responses
* Business Data

Business data belongs in IndexedDB.

---

# React Query

React Query is used for cache management.

It should query repositories instead of HTTP.

```
React Query

↓

Repository

↓

IndexedDB
```

The repository abstracts away the storage implementation.

---

# Design Rules

✅ Components never call fetch()

✅ Features never know whether the application is online

✅ Repositories never communicate with Express

✅ Sync Service is the only layer that communicates with the API

✅ PostgreSQL remains the source of truth

✅ IndexedDB is the local source of truth while offline

✅ Every write is transactional

✅ Synchronization is incremental

✅ The UI always reads from IndexedDB

---

# Technology Stack

| Layer | Technology |
|---------|------------|
| UI | React |
| Routing | React Router v7 |
| State | TanStack Query |
| Local Database | Dexie (IndexedDB) |
| Backend | Express |
| ORM | Drizzle |
| Cloud Database | PostgreSQL |
| Validation | Zod |
| Authentication | JWT |
| Synchronization | Custom Sync Engine |
| PWA | Vite PWA + Workbox |

---

# Future Improvements

Possible future enhancements include:

* End to end encrypted local storage
* Multi device synchronization
* Conflict resolution UI
* Background Sync API
* Push based synchronization
* CRDT based collaboration
* Desktop support using Tauri