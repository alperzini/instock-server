import "dotenv/config"; // Loads environment variables
import express from "express"; // ESM import
import warehouseRoutes from "./src/routes/warehouses.js"

const app = express(); // Create express instance

const PORT = process.env.PORT || 8080;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a simple route
app.get("/", (req, res) => {
    res.send("Hello Team Merkaats");
});

// warehouseRoutes
app.use("/warehouses", warehouseRoutes);



// Start server
// node server.js
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
