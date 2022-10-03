const mongoose = require('mongoose');

const adminsSchema = new mongoose.Schema({
    familycode: {
        type: String,
        required: true
    },
    useremail: {
        type: String, //付費成員email
        required: true
    }
});

mongoose.model('Admins', adminsSchema);