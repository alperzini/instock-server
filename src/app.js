import express from "express";
import cors from "cors"; 
/*
import ... from "./routes/...";
import ... from "./routes/...";
*/

const app = express(); //create an instance of express, app will be used to define routes and middleware, never change this line, remove your comments at the end of the assignment
app.use(cors());
// Middleware to parse json request bodies
app.use(express.json()); //important for parsing JSON request bodies POST and PUT requests

/* Routes
app.use("/...", ...);
app.use("/...", ...);


export default app;


