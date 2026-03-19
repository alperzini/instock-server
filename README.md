# InStock Server

![npm version](https://img.shields.io/npm/v/instock-server?style=flat-square)
![build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![license](https://img.shields.io/badge/license-ISC-blue?style=flat-square)

## What the project does

InStock Server is the backend API for an inventory management system. It provides warehouse, inventory, and category endpoints that allow managing product stock and warehouse metadata via a MySQL database.

- Express 5 REST API
- MySQL database connection via `mysql2/promise`
- CRUD operations for warehouses and inventory items
- Inventory categories endpoint
- Input validation for relationships, email, phone, and quantities

## Why the project is useful

- Centralized inventory control for multi-warehouse operations
- Data integrity with relational warehouse/inventory checks
- Simple JSON API suitable for integration with frontends or mobile apps
- Production-ready foundation with optimistic defaults and clear status responses

## Project structure

- `server.js` - entrypoint, middleware, routes mounting
- `src/db/db.js` - MySQL pool config using env vars
- `src/db/instock.sql` - schema + seed data
- `src/routes/warehouses.js` - warehouse routes: list, get, create, update, delete, warehouse inventory
- `src/routes/inventories.js` - inventory routes: list, get, create, update, delete
- `src/routes/categories.js` - categories route: list distinct inventory categories

## Getting started

### Prerequisites

- Node.js 18+ (or latest LTS)
- MySQL 8+ database

### Setup

1. clone the repo
   ```bash
   git clone https://github.com/alperzini/instock-server.git
   cd instock-server
   ```

2. install dependencies
   ```bash
   npm install
   ```

3. create `.env` in the root with MySQL settings
   ```ini
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DATABASE=instock
   PORT=8080
   ```

4. initialize database
   - run SQL file from MySQL client:
     ```sql
     SOURCE ./src/db/instock.sql;
     ```

5. start server
   ```bash
   npm run start
   ```

6. verify
   - Open `http://localhost:8080/` should return `Hello Team Miraculous Meerkats 🦦`

### Development mode

```bash
npm run dev
```

## API endpoints

Base URL: `http://localhost:8080`

### Warehouses

- `GET /warehouses` - list warehouses
- `GET /warehouses/:id` - get one warehouse
- `POST /warehouses` - create warehouse
- `PATCH /warehouses/:id` - partial update warehouse
- `DELETE /warehouses/:id` - delete warehouse
- `GET /warehouses/:id/inventories` - inventory in a warehouse

### Inventories

- `GET /inventories` - list all inventory
- `GET /inventories/:id` - get one inventory item
- `POST /inventories` - create inventory item
- `PATCH /inventories/:id` - partial update inventory
- `DELETE /inventories/:id` - delete inventory

### Categories

- `GET /categories` - list distinct item categories

## Example requests

### Create a warehouse

```bash
curl -X POST http://localhost:8080/warehouses \
-H "Content-Type: application/json" \
-d '{
  "warehouse_name": "Central",
  "address": "1 Main St",
  "city": "New York",
  "country": "USA",
  "contact_name": "Jane Doe",
  "contact_position": "Manager",
  "contact_phone": "+1 (555) 111-2222",
  "contact_email": "jane.doe@example.com"
}'
```

### Create inventory

```bash
curl -X POST http://localhost:8080/inventories \
-H "Content-Type: application/json" \
-d '{
  "warehouse_id": 1,
  "item_name": "USB Cable",
  "description": "USB-C to USB-A",
  "category": "Electronics",
  "status": "In Stock",
  "quantity": 200
}'
```

## Where to get help

- Check existing issues and open a new issue in this repository
- Use the project `README.md` for basic setup
- For environment errors, verify MySQL and `.env` credentials

## Who maintains and contributes

- Maintainer: `alperzini` (source repository author)
- Contributions are welcome via pull requests
- For contribution guidance: [CONTRIBUTING.md](CONTRIBUTING.md) (if present)

### Recommended workflow

1. Fork repository
2. Create feature branch
3. Add tests (if applicable)
4. Open PR with description and screenshots (UI/changes)

## Notes

- No tests are configured in the current codebase (`npm test` is placeholder).
- Add `npm run lint` and test suite as future improvements.
