const mongoose = require('mongoose');

const familiesSubSchema = new mongoose.Schema({
    familycode: {
        type: String,
        required: true
    },
    //有紀錄且duedate 大於 datetime.now 即表示續用，即paid = 'Y' 否則 paid ='N'
    // actionitem: {
    //     type: String, //Apply,continue 申請/續用
    //     required: true
    // },
    // paid: {
    //     type: String, //Y/N是否已付費
    //     required: true
    // },
    paytype: {
        type: String, //月/季/年 M/S/Y
        required: false
    },
    payid: {
        type: String, //付費表流水號
        required: false
    },
    actiondate: {
        type: Number,//付費起算日期
        required: true
    },
    paiddate: {
        type: Number,//付費日期
        required: false
    },
    duedate: {
        type: Number,//付費使用結束日期
        required: false
    },
    descript: {
        type: String, //說明
        required: false
    }
});

mongoose.model('FamiliesSub', familiesSubSchema);