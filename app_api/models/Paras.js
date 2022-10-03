const mongoose = require('mongoose');

const parasSchema = new mongoose.Schema({
    paraType: {
        type: String,
        required: true
    },
    paraName: {
        type: String,
        required: true
    },
    paraText: String,
    paraNo: Number,
    paraMemo: String
});
mongoose.model('Paras', parasSchema);