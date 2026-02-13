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
        res.status(500).json({ message: "Failed to create attendee" });
    }
}

// POST /warehouse
router.post("/", addWarehouse);



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






*/


