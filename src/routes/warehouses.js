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

// GET /warehouses/:id

export const getWarehouseById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM warehouses WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch warehouse "})
    }
}

router.get("/:id", getWarehouseById);



export default router;

/* API Testing
GET All the warehouses:
http://localhost:8080/warehouses

GET single warehouse:
http://localhost:8080/warehouses/1
http://localhost:8080/warehouses/5
http://localhost:8080/warehouses/999 //returns 404





*/


