const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true
    },
    items: [{
        productid: {
            type: mongoose.Schema.Types.ObjectId, 
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

const Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;