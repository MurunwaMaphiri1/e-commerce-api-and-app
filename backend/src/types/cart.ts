import { Document, Types } from "mongoose";

interface ICartItem {
    productId: Types.ObjectId,
    quantity: Number;
}

export interface ICart extends Document {
    userId: Types.ObjectId,
    items: ICartItem[];
}