const mongoose = require('mongoose');

const fmaccountSchema = new mongoose.Schema({
    familycode: {
        type: String,
        required: true
    },
    useremail: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    memo: String,
    cyear: {
        type: String,//購買日期 yyyy/mm/dd
        required: true
    },
    cmonth: {
        type: String,//購買日期 yyyy/mm/dd
        required: true
    },
    cday: {
        type: String,//購買日期 yyyy/mm/dd
        required: true
    },
    itemtype: {
        type: String,//商品類型
        required: false
    },
    locate: {
        type: String, //購買地點
        required: false
    },
    shop: {
        type: String, //購買店家
        required: false
    },
    createdate: {
        type: Date, //日期
        default: Date.now() / 1000
    }
});

const newLocal = 'Fmaccount';
mongoose.model(newLocal, fmaccountSchema);