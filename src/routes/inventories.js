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
        res.status(500).json({ message: "Failed to fetch inventories" });
    }
}
router.get("/", getAllInventories);

// GET /inventories/:id
export const getInventoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM inventories WHERE id = ?;", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch inventory"})
    }
}
router.get("/:id", getInventoryById);


export default router;