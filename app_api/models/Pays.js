const mongoose = require('mongoose');

const paySchema = new mongoose.Schema({
    familycode: {
        type: String,
        required: true
    },
    useremail: {
        type: String, //付費成員email
        required: true
    },
    amount: {
        type: Number, //金額
        required: true
    },
    discount: {
        type: String, //不折1,7折0.7
        required: true
    },
    paymethod: {
        type: String,//{ value: 'CD', name: '信用卡' },{ value: 'CH', name: '現金' },{ value: 'TF', name: '匯款' },{ value: 'OT', name: '其他' }…
        required: true
    },
    paytype: {
        type: String, //月/季/年 M/S/Y
        required: false
    },
    actiondate: {
        type: Number,//付費起算日期
        required: true
    },
    duedate: {
        type: Number,//使用期限
        required: true
    }
});

//判斷是否已付款，邏輯:取家庭最後1筆紀錄，如果現今的時間小於duedate表示已付款
paySchema.methods.NewOrderPaid=function(pDuedate){
    const paid = new Date().getTime()/1000 > pDuedate ? "N":"Y";
    return paid;
}

mongoose.model('Pays', paySchema);