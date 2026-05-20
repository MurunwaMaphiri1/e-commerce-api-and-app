import mongoose, { Schema, Model, Types } from "mongoose";
import type { IOrder } from "../types/orders.ts";

const orderSchema: Schema<IOrder> = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId, 
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
    }],
    total: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Orders: Model<IOrder> = mongoose.model<IOrder>("Orders", orderSchema);

export default Orders;