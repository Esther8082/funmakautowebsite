import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ➤ ADD a product
router.post("/add", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save(); res.status(201).json({ message: "Product added", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➤ GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➤ GET single product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); // ➤ DELETE a product
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;