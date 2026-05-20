import mongoose, { Schema, Model, Types } from "mongoose";
import type { ICart } from "../types/cart.js";

const cartSchema: Schema<ICart> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
})

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema)

export default Cart;