import type { Request, Response } from "express";
import Orders from "../models/orders.model.js";
import mongoose from "mongoose";
import Products from "../models/product.model.js";

// List all Orders
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Orders.find();
        res.status(200).send(orders);
    } catch(error) {
        res.status(500).send({ message: "Error occured while listing orders" });
    }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
    try {

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).send({ message: "Invalid ID" })
        }

        const id = req.params.id;
        const orderId = await Orders.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: true, userId: true, items: true, total: true, orderStatus: true, createdAt: true } }
        ])

        if (!orderId.length) {
            return res.status(404).send({ message: "Order not found" })
        }

        res.status(200).send(orderId[0]);
    } catch(error) {
        res.status(500).send({ message: "Error occured while fetching order" })
    }
};

// Add Order 
export const addOrder = async (req: Request, res: Response) => {
    try {

        const { userID, items, total } = req.body;

        if (!userID || !items || !total) 
        {
            return res.status(400).send({
                message: "Fields cannot be empty"
            })
        }
        const order = await Orders.create(
            {
                userID,
                items,
                total,
            }
        )

        res.send({
            message: "Order added successfully",
            order: order
        });

    } catch(error) {
        res.status(500).send({ message: "Error occurred while adding order" });
    }
};

// Delete Order
export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const id = req.body.id;

        if (!id) {
            return res.status(400).send({
                message: "id parameter cannot be empty"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID" });
        }

        const orderID = await Orders.deleteOne(
            { _id: id }
        );

        if (orderID.deletedCount === 0) {
            return res.status(404).send({ message: "Order not found" });
        };

        res.status(200).json({ message: "Order deleted successfully" });
    } catch(error) {
        res.status(500).send({ message: "Error occurred while deleting order" });
    }
};

// Update Order
export const updateOrder = async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        if (!id) {
            return res.status(400).send({
                message: "id parameter is required"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID" });
        }

        const { items, total, orderStatus } = req.body;

        const order = await Orders.findByIdAndUpdate(
            { _id: id },
            { items,
                total,
                orderStatus,
            },
            { new: true, runValidators: true }
        )

        res.send({
            message: "Order updated successfully",
            product: order
        })

    } catch(error) {
        res.status(500).send({ message: "Error occured while updating order" });
    }
};