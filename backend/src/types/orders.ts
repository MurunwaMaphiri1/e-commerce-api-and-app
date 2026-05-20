import { Document, Types } from "mongoose";

interface IOrderItem {
    productId: Types.ObjectId,
    quantity: Number;
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    items: IOrderItem[];
    total: Number;
    orderStatus: string;
    createdAt: Date;
}

