import type { Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/cart.model.js";

// Get Cart by User ID
export const getCartByUserId = async (req: Request, res: Response) => {
    try {

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).send({ message: "Invalid ID" });
        }

        const userId = new mongoose.Types.ObjectId(req.params.id);

        const cart = await Cart.aggregate([
            { $match: { userId } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $addFields: {
                    totalPrice: { $multiply: ["$items.quantity", "$productDetails.price"] }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    items: {
                        $push: {
                            productId: "$items.productId",
                            quantity: "$items.quantity",
                            productName: "$productDetails.name",
                            productImage: "$productDetails.image",
                            pricePerUnit: "$productDetails.price",
                            totalPrice: "$totalPrice"
                        }
                    }
                }
            }
        ]);

        if (!cart.length) {
            return res.status(200).send({ userId, items: [] });
        }

        res.status(200).send(cart[0]);

    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
};

//Add to cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.params.id; 

        if (!productId || !quantity) {
            return res.status(400).send({
                message: "Product and quantity are required"
            });
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            const productIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (productIndex >= 0) {
                cart.items[productIndex]!.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        } else {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity }],
            });
        }


        await cart.save();
        res.status(200).send({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error("Error while updating cart:", error);
        res.status(500).send({ message: "Internal server error", error });
    }
}

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const { productId, quantity } = req.body as { productId: string; quantity: number };

        // const userId = req.params.id;

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).send({ message: "Invalid user ID" });
        }

        const userId = new mongoose.Types.ObjectId(req.params.id);

        if (!productId) {
            return res.status(400).send({ message: "productId is required" });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).send({ message: "Quantity must be a positive number" });
        }

        const updatedRecord = await Cart.updateOne(
            { userId: userId, "items.productId": productId },
            { $set: { "items.$.quantity": quantity } }
        );

        if (updatedRecord.matchedCount === 0) {
            return res.status(404).send({ message: "Cart or item not found" });
        }

        res.status(200).send({ message: "Item updated successfully", updatedRecord });

    } catch (error) {
        res.status(500).send({ message: "Error occurred while updating cart item" });
    }
};

// Delete cart item
export const deleteCartItem = async (req: Request, res: Response) => {
    try {
        // const userId = req.params.id;
        const { productId } = req.body as { productId: string };

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).send({ message: "Invalid user ID" });
        }

        if (!productId) {
            return res.status(400).send({ message: "productId is required" });
        }

        const userId = new mongoose.Types.ObjectId(req.params.id);

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).send({ message: "Item not found in cart" });
        }

        cart.items.splice(itemIndex, 1);
        const updatedCart = await cart.save();

        res.status(200).send(updatedCart);

    } catch (error) {
        res.status(500).send({ message: "Failed to delete item from cart" });
    }
};