import express from "express";
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
        res.status(500).json({ message: "Failed to fetch events" });
    }
}

router.get("/", getAllWarehouses);





export default router;


