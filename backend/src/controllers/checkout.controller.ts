import type { Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import stripe from "../config/stripe.js";

export const checkout = async (req: Request, res: Response) => {

    if (!req.params.id || typeof req.params.id !== "string") {
        return res.status(400).send({ message: "Invalid ID" })
    }

    const userId = new mongoose.Types.ObjectId(req.params.id);

    try {
        const cartData = await Cart.aggregate([
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

        if (!cartData.length) {
            return res.status(404).json({ error: "Cart not found for user" });
        }

        const cartItems = cartData[0].items;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "No items in cart" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: cartItems.map((item: any) => ({
                price_data: {
                    currency: "ZAR",
                    product_data: {
                        name: item.productName,
                        images: [`http://localhost:8000${item.productImage}`]
                    },
                    unit_amount: Math.round(item.pricePerUnit * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });

        res.status(200).json({ sessionId: session.id });

    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({ error: "An error occurred while processing checkout" });
    }
};