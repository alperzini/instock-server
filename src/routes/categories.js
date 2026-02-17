import { Router } from "express";
import db from "../db/db.js";

const router = Router();

// GET /categories
export const getInventorCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT DISTINCT category FROM inventories;");
        res.json(rows.map((row) => row["category"]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch inventory categories"})
    }
}
router.get("/", getInventorCategories);

export default router;