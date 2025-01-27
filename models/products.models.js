const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
        type: Array,
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

const Products = mongoose.model("Products", productSchema);
module.exports = Products;