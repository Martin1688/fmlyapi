const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    regulation: {
        type: String,
        required: true
    },
    amount: {
        type: Number, //金額
        required: true
    },
    Currency: {
        type: String, //付費幣別
        required: true
    }
});

mongoose.model('Price', priceSchema);