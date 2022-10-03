const mongoose = require('mongoose');

const incomesSchema = new mongoose.Schema({
    familycode: {
        type: String,
        required: true
    },
    useremail: {
        type: String, //付費成員email
        required: true
    },
    incometitle: {
        type: String, //收入名稱(來源)
        required: true
    },
    amount: {
        type: Number, //金額
        required: true
    },
    yearmonth: {
        type: String, //收入年月 yyyy/mm
        required: true
    },
    updatedate: {
        type: Number,
        required: true
    }
});

mongoose.model('Incomes', incomesSchema);