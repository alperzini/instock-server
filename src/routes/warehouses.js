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
    try {
        const { id } = req.params;
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
    try {
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

        if (!warehouse_name)
            return res.status(400).json({ message: "Please enter the warehouse name." });
        if (!address)
            return res.status(400).json({ message: "Please enter the warehouse address." });
        if (!city)
            return res.status(400).json({ message: "Please enter the warehouse city." });
        if (!country)
            return res.status(400).json({ message: "Please enter the warehouse country." });
        if (!contact_name)
            return res.status(400).json({ message: "Please enter the contact name." });
        if (!contact_position)
            return res.status(400).json({ message: "Please enter the contact position." });
        if (!contact_phone)
            return res.status(400).json({ message: "Please enter the contact phone number." });
        if (!contact_email)
            return res.status(400).json({ message: "Please enter the contact email." });

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact_email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Phone Validation
        const phoneRegex = /^(?:\+1|1?)?\s?(\(\d{3}\)|\d{3})[-.\s]?(\(\d{3}\)|\d{3})[-.\s]?(\(\d{4}\)|\d{4})$/;
        if (!phoneRegex.test(formData.contact_phone)) {
            newErrors.contact_phone = "Please enter a valid phone number";
        }

        // Insert Into Database
        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        await db.query(
            `INSERT INTO warehouses 
            (warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                warehouse_name,
                address,
                city,
                country,
                contact_name,
                contact_position,
                contact_phone,
                contact_email,
                timestamp,
                timestamp
            ]
        );

        // Retrive the created row
        const [rows] = await db.query("SELECT LAST_INSERT_ID() AS id;");
        const newId = rows[0].id;

        const [created] = await db.query(
            "SELECT * FROM warehouses WHERE id = ?;",
            [newId]
        );

        return res.status(201).json({
            message: "Warehouse created successfully",
            data: created[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to create warehouse" });
    }
};
// POST /warehouses
router.post("/", addWarehouse);


// update the warehouse (PATCH) 
export const updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;

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

    try {
        const { id } = req.params;
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
    try {
        const { id } = req.params;
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