import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import productRoutes from "./routes/productRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// MONGO CONNECTION
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/products", productRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



