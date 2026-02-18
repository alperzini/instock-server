import { Router } from "express";
import db from "../db/db.js";

const router = Router();

// GET /inventories
export const getAllInventories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM inventories;")
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Failed to fetch inventories" );
    }
}
router.get("/", getAllInventories);

// GET /inventories/:id
export const getInventoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM inventories WHERE id = ?;", [id]);

        if (rows.length === 0) {
            return res.status(404).json("Inventory not found" );
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json("Failed to fetch inventory" )
    }
}
router.get("/:id", getInventoryById);

// POST /inventories
export const addInventory = async (req, res) => {
    const { warehouse_id, item_name, description, category, status, quantity } = req.body;
    try {
        // All values are required
        if (!warehouse_id)
            return res.status(400).json("Warehouse is not specified.");
        else if (!item_name)
            return res.status(400).json("Please enter the item name.");
        else if (!description)
            return res.status(400).json("Please enter the item description.");
        else if (!category)
            return res.status(400).json("Please enter the item category.");
        else if (!status)
            return res.status(400).json("Please enter the status of the item.");
        else if (quantity === null || quantity === undefined || quantity === "") // Accept 0 for quantity
            return res.status(400).json("Please enter the item quantity.");

        // quantity must be a number
        const quantityNum = Number(quantity);
        if (isNaN(quantityNum) || !Number.isInteger(quantityNum) || quantityNum < 0)
            return res.status(400).json("The item quantity must be a positive integer number.");

        // Check warehouse_id matches an existing warehouse
        const [rows] = await db.query("SELECT id FROM warehouses WHERE id = ?;", [warehouse_id]);
        if (rows.length === 0)
            return res.status(400).json("Warehouse is not found.");

        // DB Insert
        const today = new Date().toISOString().replace('T', ' ').split('.')[0];
        await db.query(`INSERT INTO inventories 
            (warehouse_id, item_name, description, category, status, quantity, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [warehouse_id, item_name, description, category, status, quantity, today, today]);

        // Get ID of newly inserted inventory
        let [id] = await db.query("SELECT LAST_INSERT_ID();");
        id = id[0]['LAST_INSERT_ID()'];
        const [created] = await db.query("SELECT * FROM inventories WHERE id = ?;", [id]);

        return res.status(201).json({
            message: "Inventory created successfully",
            data: created[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json("Failed to create inventory.");
    }
}
router.post("/", addInventory);

// Patch /inventories/:id
export const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { warehouse_id, item_name, description, category, status, quantity } = req.body;

    try {
        // ensure that inventory exists
        const [existing] = await db.query("SELECT * FROM inventories WHERE id = ?;", [id]);
        if (existing.length === 0)
            return res.status(404).json("Inventory is not found.");

        // quantity must be a number
        if (quantity) { // Otherwise get exisitng quantity
            const quantityNum = Number(quantity);
            if (isNaN(quantityNum) || !Number.isInteger(quantityNum) || quantityNum < 0)
                return res.status(400).json("The item quantity must be a positive integer number.");
        }

        // Check warehouse_id matches an existing warehouse
        if (warehouse_id) { // Otherwise get exisitng warehouse_id
            const [rows] = await db.query("SELECT id FROM warehouses WHERE id = ?;", [warehouse_id]);
            if (rows.length === 0)
                return res.status(400).json("Warehouse is not found.");
        }

        // DB update
        const today = new Date().toISOString().replace('T', ' ').split('.')[0];
        await db.query(
            `UPDATE inventories 
             SET warehouse_id = ?, item_name = ?, description = ?, category = ?, status = ?, quantity = ?, updated_at = ?
             WHERE id = ?;`,
            [
                warehouse_id || existing[0].warehouse_id,
                item_name || existing[0].item_name,
                description || existing[0].description,
                category || existing[0].category,
                status || existing[0].status,
                quantity || existing[0].quantity,
                today,
                id
            ]
        );

        // Get newly updated inventory
        const [updated] = await db.query("SELECT * FROM inventories WHERE id = ?", [id]);

        return res.status(200).json({
            message: "Inventory updated successfully.",
            data: updated[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json("Failed to update inventory.");
    }
};
router.patch("/:id", updateInventory);

// Delete /inventories/:id
export const deleteInventory = async (req, res) => {
    const { id } = req.params;

    try {
        // ensure that inventory exists
        const [existing] = await db.query("SELECT * FROM inventories WHERE id = ?;", id);
        if (existing.length === 0)
            return res.status(404).json("Inventory is not found.");

        // DB delete
        await db.query(`DELETE FROM inventories WHERE id = ?;`, id);

        return res.status(204).end();
    } catch (err) {
        console.error(err);
        return res.status(500).json("Failed to delete inventory.");
    }
};
router.delete("/:id", deleteInventory);

export default router;