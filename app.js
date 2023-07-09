import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT_NUMBER || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

//CORS policy
app.use(cors());

// Databse connection
connectDB(DATABASE_URL);

// JSON
app.use(express.json());

// Load routes
app.use("/api/user", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})