import { Router } from "express";
import db from "../db/db.js";

const router = Router();

// GET /warehouses

export const getAllWarehouses = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM warehouses")
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch warehouses" });
    }
}

router.get("/", getAllWarehouses);

// GET /warehouses/:id

export const getWarehouseById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM warehouses WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Warehouse not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch warehouse"})
    }
}

router.get("/:id", getWarehouseById);


// create a new warehouse (POST)

export const addWarehouse = async (req, res) => {
    const { id, warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;
    try {

        // Email Validation 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact_email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Phone Validation
        // Allow: 123-456-7890, (123)456-7890, +1 604 123 4567, 6041234567, etc.
        const cleanPhone = contact_phone.replace(/\D/g, ""); // remove non-numbers

        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            return res.status(400).json({ message: "Please enter a valid phone number" });
        }

        // DB Insert
        await db.query("INSERT INTO warehouses (id, warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [id, warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email]);

        return res.status(201).json({ 
            message: "Warehouse created successfully" 
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to create warehouse" });
    }
}

// POST /warehouses
router.post("/", addWarehouse);


// update the warehouse (PATCH) 
export const updateWarehouse = async (req, res) => {
    const { id } = req.params;
    const {
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email
    } = req.body;

    try {
        // ensure that warehouse exist
        const [existing] = await db.query(
            "SELECT * FROM warehouses WHERE id = ?", [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: "Warehouse not found"});
        }


        // Email Verification
        if (contact_email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contact_email)) {
                return res.status(400).json({ message: "Please enter a valid email address" });
            }
        }

        // Phone Verification
        // Allow: 123-456-7890, (123)456-7890, +1 604 123 4567, 6041234567, etc.
        if (contact_phone) {
            const cleanPhone = contact_phone.replace(/\D/g, ""); // remove non-numbers

            if (cleanPhone.length < 10 || cleanPhone.length > 15) {
                return res.status(400).json({ message: "Please enter a valid phone number" });
            }
        };

        await db.query(
            `UPDATE warehouses 
             SET warehouse_name = ?, 
                 address = ?, 
                 city = ?, 
                 country = ?, 
                 contact_name = ?, 
                 contact_position = ?, 
                 contact_phone = ?, 
                 contact_email = ?
             WHERE id = ?`,
            [
                warehouse_name || existing[0].warehouse_name,
                address || existing[0].address,
                city || existing[0].city,
                country || existing[0].country,
                contact_name || existing[0].contact_name,
                contact_position || existing[0].contact_position,
                contact_phone || existing[0].contact_phone,
                contact_email || existing[0].contact_email,
                id
            ]
        );

        const [updated] = await db.query(
            "SELECT * FROM warehouses WHERE id = ?", [id]
        );

        return res.status(200).json({
            message: "Warehouse updated successfully",
            data: updated[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update warehouse" });
    }
};
// Patch /warehouses/:id
router.patch("/:id", updateWarehouse);

// Delete /warehouses/:id
export const deleteWarehouse = async (req, res) => {
    const { id } = req.params;

    try {
        // ensure that warehouse exists
        const [existing] = await db.query("SELECT * FROM warehouses WHERE id = ?;", id);
        if (existing.length === 0)
            return res.status(404).json("Warehouse is not found.");

        // DB delete
        await db.query(`DELETE FROM warehouses WHERE id = ?;`, id);

        return res.status(204).end();
    } catch (err) {
        console.error(err);
        return res.status(500).json("Failed to delete warehouse.");
    }
};
router.delete("/:id", deleteWarehouse);

export default router;

/* API Testing
GET All the warehouses:
http://localhost:8080/warehouses

GET single warehouse:
http://localhost:8080/warehouses/1
http://localhost:8080/warehouses/5
http://localhost:8080/warehouses/999 //returns 404

POST a single warehouse:
POST http://localhost:8080/warehouses
Body Data:
{
  "id": 9,
  "warehouse_name": "Burnaby Central Warehouse",
  "address": "123 Production Way",
  "city": "Burnaby",
  "country": "Canada",
  "contact_name": "Alex Morgan",
  "contact_position": "Warehouse Manager",
  "contact_phone": "+1 (604) 555-9823",
  "contact_email": "alex.morgan@example.com"
}

PATCH update the warehouse:
PATCH http://localhost:8080/warehouses/9
Body Data:
{
  "city": "Vancouver",
  "contact_email": "newemail@example.com"
}
*/


