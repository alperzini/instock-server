import "dotenv/config"; // Loads environment variables
import express from "express"; // ESM import

const app = express(); // Create express instance

const PORT = process.env.PORT || 8080;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a simple route
app.get("/", (req, res) => {
    res.send("Hello Team Merkaats");
});

// Start server
// node server.js
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
