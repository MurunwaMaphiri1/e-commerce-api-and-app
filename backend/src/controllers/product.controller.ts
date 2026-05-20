import type { Request, Response } from "express";
import Products from "../models/product.model.js";
import mongoose from "mongoose";

// List all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Products.find();
        res.status(200).send(products);
    } catch(error) {
        res.status(500).send({ message: "Error fetching products" })
    }
};

// Add Product
export const addProduct = async (req: Request, res: Response) => {
    try {
        
        const { name, quantity, category, price, productDescription, image } = req.body;

        if (!name || !quantity || !category || !price) {
            return res.status(400).send({
                message: "Fields cannot be empty"
            });
        }
        
        const product = await Products.create(
            {
                name,
                quantity,
                category,
                price,
                productDescription,
                image
            }
        );

        res.send({
            message: "Product added successfully",
            product: product
        });

    } catch(error) {
        res.status(500).send({ message: "Error occured while adding product" })
    }
};

// List product by ID
export const listProductById = async (req: Request, res: Response) => {
    try {

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).send({ message: "Invalid ID" })
        }

        const id = req.params.id;
        const productID = await Products.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: true, name: true, price: true, productDescription: true, image: true } }
        ])

        if (!productID.length) {
            return res.status(404).send({ message: "Product not found" })
        }

        res.status(200).send(productID[0]);
    } catch(error) {
        res.status(500).send({ message: "Error occured while fetching product" })
    }
};

// Delete product by ID
export const deleteByProductId = async (req: Request, res: Response) => {
    try {

        if (!req.query.id || typeof req.query.id !== "string") {
            return res.status(400).send({ message: "Invalid ID" });
        }

        const id = req.query.id;
        const result = await Products.deleteOne(
            { _id: new mongoose.Types.ObjectId(id) }
        );

        if (!result.deletedCount) {
            return res.status(404).send({
                message: "Product not found"
            })
        };
        res.status(200).json({ message: "Product deleted successfully" });
    } catch(error) {
        res.status(500).send({ message: "Error occured while deleting product" })
    }
};

// Update Product by ID
export const updateProductById = async (req: Request, res: Response) => {
    try {
        
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({
                message: "id parameter is required"
            });
        }

        if (!id || typeof id !== "string") {
            return res.status(400).send({ message: "Invalid ID" });
        }

        const { name, quantity, category, price, productDescription, image } = req.body;

        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            {
                name: name,
                quantity: quantity,
                category: category,
                price: price,
                productDescription: productDescription,
                image: image
            },
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        res.send({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).send({
            message: "Error occured while updating product",
        });
    }
};

