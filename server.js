import "dotenv/config"; // Loads environment variables
import express from "express"; // ESM import
import cors from "cors";
import warehouseRoutes from "./src/routes/warehouses.js";
import inventoryRoutes from "./src/routes/inventories.js";
import categoryRoutes from "./src/routes/categories.js";


const app = express(); // Create express instance

const PORT = process.env.PORT || 8080;

app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Define a simple route
app.get("/", (req, res) => {
    res.send("Hello Team Miraculous Meerkats 🦦");
});

// warehouseRoutes
app.use("/warehouses", warehouseRoutes);

// inventoryRoutes
app.use("/inventories", inventoryRoutes);

// categoryRoutes
app.use("/categories", categoryRoutes);


// Start server
// node server.js
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
