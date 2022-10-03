const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');
//const ctrlAuth = require('../controllers/authentication');
//const pws = "Ab123456";
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
let done = false;
let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
});


const mailOfForgetPws = (req, res) => {
    const pws = crypto.randomBytes(5).toString('hex').toUpperCase();
    const userMailUrl = req.body.email;
console.log(EMAIL);
console.log(userMailUrl);
console.log(pws);

    done=true;
    setTimeout(() => {
        const mailOptions = {
            from: EMAIL,
            to: userMailUrl,
            subject: "家庭收入支出網站用戶新密碼",
            html: `<h4>貴用戶的新密碼：${pws}</h4>`
        };
        if (done) {
            transporter.sendMail(mailOptions, (err, info) => {
                //console.log('sending mail');
                if (err) {
                    console.log(err);
                    return;
                }
                if (info) {
                    console.log('ok' + info);
                }
                return res.status(200).send({
                    "message": "Password set and Email Send Successfully.","data":""
                });
            });
        } else {
            return res.status(400).send({ "message": "Account not found or error","data":"" })
        }

    }, 1000);
}

const mailCreateFamily = (req, res, password) => {
    const pws = password;
    const familyname = req.body.familyName;
    const userMailUrl = req.body.email;
    const admin = req.body.name;
//console.log(EMAIL);
console.log(userMailUrl);
//console.log(pws);

    done=true;
    setTimeout(() => {
        const mailOptions = {
            from: EMAIL,
            to: userMailUrl,
            subject: "家庭收入支出網站-家庭用戶建立成功通知EMAIL",
            html: `<h4>家庭名稱：${familyname}</h4><h4>管理人(${admin})EMAIL：${userMailUrl}</h4><h4>管理人密碼：${pws}</h4>`
        };
        if (done) {
            transporter.sendMail(mailOptions, (err, info) => {
                //console.log('sending mail');
                if (err) {
                    console.log(err);
                    return;
                }
                if (info) {
                    console.log('ok' + info);
                }
                res.status(200).json({
                    "message": "家庭收入支出網站-家庭用戶建立成功，請到登記的EMAIL查看登入網站之相關資料!","data":""
                });
            });
        } else {
            res.status(400).json({
                "message": "家庭收入支出網站-家庭用戶建立失敗!","data":""
            });
        }

    }, 1000);
}


module.exports = {
    mailOfForgetPws,
    mailCreateFamily
}

