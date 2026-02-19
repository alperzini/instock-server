import { Router } from "express";
import db from "../db/db.js";

const router = Router();

// GET /warehouses

export const getAllWarehouses = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM warehouses;")
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
        const [rows] = await db.query("SELECT * FROM warehouses WHERE id = ?;", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Warehouse not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch warehouse" })
    }
}

router.get("/:id", getWarehouseById);


// create a new warehouse (POST)

export const addWarehouse = async (req, res) => {
    const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;
    try {

        // All values are required
        if (!warehouse_name)
            return res.status(400).json("Please enter the warehouse name.");
        else if (!address)
            return res.status(400).json("Please enter the warehouse address.");
        else if (!city)
            return res.status(400).json("Please enter the warehouse city.");
        else if (!country)
            return res.status(400).json("Please enter the warehouse country.");
        else if (!contact_name)
            return res.status(400).json("Please enter the warehouse contact name.");
        else if (!contact_position)
            return res.status(400).json("Please enter the warehouse contact position.");
        else if (!contact_phone)
            return res.status(400).json("Please enter the warehouse contact phone number.");
        else if (!contact_email)
            return res.status(400).json("Please enter the warehouse contact email.");

        // Email Validation 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact_email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Phone Validation
        const phoneRegex = /^(?:\+1|1?)?\s?(\(\d{3}\)|\d{3})[-.\s]?(\(\d{3}\)|\d{3})[-.\s]?(\(\d{4}\)|\d{4})$/;
        if (!phoneRegex.test(contact_phone)) {
            return res.status(400).json({ message: "Please enter a valid phone number" });
        }

        // DB Insert
        const today = new Date().toISOString().replace('T', ' ').split('.')[0];
        await db.query(`INSERT INTO warehouses 
            (warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email, today, today]);

        // Get ID of newly inserted warehouse
        let [id] = await db.query("SELECT LAST_INSERT_ID();");
        id = id[0]['LAST_INSERT_ID()'];
        const [created] = await db.query("SELECT * FROM warehouses WHERE id = ?;", [id]);

        return res.status(201).json({
            message: "Warehouse created successfully",
            data: created[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create warehouse" });
    }
}
// POST /warehouses
router.post("/", addWarehouse);


// update the warehouse (PATCH) 
export const updateWarehouse = async (req, res) => {
    const { id } = req.params;
    const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;

    try {
        // ensure that warehouse exist
        const [existing] = await db.query("SELECT * FROM warehouses WHERE id = ?;", [id]);

        if (existing.length === 0) {
            return res.status(404).json({ message: "Warehouse not found" });
        }


        // Email Verification
        if (contact_email) { // Otherwise get exisitng contact_email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contact_email)) {
                return res.status(400).json({ message: "Please enter a valid email address" });
            }
        }

        // Phone Verification
        if (contact_phone) { // Otherwise get exisitng contact_phone
            const phoneRegex = /^(?:\+1|1?)?\s?(\(\d{3}\)|\d{3})[-.\s]?(\(\d{3}\)|\d{3})[-.\s]?(\(\d{4}\)|\d{4})$/;
            if (!phoneRegex.test(contact_phone)) {
                return res.status(400).json({ message: "Please enter a valid phone number" });
            }
        };

        // DB update
        const today = new Date().toISOString().replace('T', ' ').split('.')[0];
        await db.query(
            `UPDATE warehouses 
             SET warehouse_name = ?, 
                 address = ?, 
                 city = ?, 
                 country = ?, 
                 contact_name = ?, 
                 contact_position = ?, 
                 contact_phone = ?, 
                 contact_email = ?,
                 updated_at = ?
             WHERE id = ?;`,
            [
                warehouse_name || existing[0].warehouse_name,
                address || existing[0].address,
                city || existing[0].city,
                country || existing[0].country,
                contact_name || existing[0].contact_name,
                contact_position || existing[0].contact_position,
                contact_phone || existing[0].contact_phone,
                contact_email || existing[0].contact_email,
                today,
                id
            ]
        );

        const [updated] = await db.query("SELECT * FROM warehouses WHERE id = ?;", id);

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

// GET /warehouses/:id/inventories
export const getWarehouseInventoryList = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT id, item_name, category, status, quantity FROM inventories WHERE warehouse_id = ?;", [id]);

        if (rows.length === 0) {
            return res.status(404).json("Warehouse not found");
        }
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Failed to fetch warehouse inventory list");
    }
}
router.get("/:id/inventories", getWarehouseInventoryList);

export default router;