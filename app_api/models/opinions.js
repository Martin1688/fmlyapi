const mongoose = require('mongoose');

const opinionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },  
    advice: {
        type: String,
        required: true
    },
    explain:  String,
    dttime: {
        type: String,
        required: true
    },
    ans:  String,
    ip:String,
    username:String
});


mongoose.model('opiniols', opinionSchema);
