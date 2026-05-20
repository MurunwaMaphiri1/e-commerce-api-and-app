import mongoose, { Schema, Model } from "mongoose";
import type { IProduct } from "../types/products.ts";

const productSchema: Schema<IProduct> = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 100
    },
    category: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String
    },
    image: {
        type: String,
        required: true
    }
})

const Products: Model<IProduct> = mongoose.model<IProduct>("Products", productSchema);

export default Products;