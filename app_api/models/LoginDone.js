const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    token: String,
    familyname: String,
    familycode: String,
    name: String,
    email: String,
    role: String,
    paid: String,
    duedate: String,
    paytype: String
});

mongoose.model('LoginDone', loginSchema);

