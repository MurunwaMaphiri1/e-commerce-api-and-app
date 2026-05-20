import { Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    quantity: Number;
    category: string[];
    price: Number;
    productDescription: string;
    image: string;
}