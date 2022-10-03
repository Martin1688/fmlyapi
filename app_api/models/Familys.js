const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    familyname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    macaddress: {
        type: String,
        required: true
    },
    memo: {
        type: String,
        required: true
    },
    applydate: {
        type: Number,
        required: true
    }
});

mongoose.model('Familys', familySchema);