const passport = require('passport');
const mongoose = require('mongoose');
const Fmly = mongoose.model('Familys');
const User = mongoose.model('User');
const Pays = mongoose.model('Pays');
const mailobj = require('./emailsendinblue');
//const mailobj = require('./emailsender');
//const { base64encode, base64decode } = require('nodejs-base64');

const register = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.familycode) {
        return res
            .status(400)
            .json({ "message": "全部欄位都必填", "data": "" });
    }

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.familycode = req.body.familycode;
    //console.log(req.body.password);
    // res.status('304').json('fromMartin');
    user.setPassword(req.body.password);
    user.save((err) => {
        console.log(err);
        if (err) {
            res
                .status(409)
                .json({ "message": user.email + " 已經被使用過了", "data": "" });
        } else {
            //const token = user.generateJwt();
            res
                .status(200)
                .json({ "message": "", "data": password });
        }
    })
};

const register2 = (req, res, fCode, password) => {
    if (!req.body.familycode) {
        return res
            .status(400)
            .json({ "message": "家庭代碼未填", "data": "" });
    }
    if (!req.body.email) {
        return res
            .status(400)
            .json({ "message": "EmailL未填", "data": "" });
    }
    const user = new User();
    //const admin =req.body.name;
    user.name = req.body.name;
    user.email = req.body.email;
    user.familycode = fCode;
    //console.log(req.body.password);
    // res.status('304').json('fromMartin');
    user.setPassword(password);
    user.save((err) => {
        console.log(err);
        if (err) {
            res
                .status(409)
                .json({ "message": user.email + " 已經被使用過了", "data": "" });
        } else {
            //mailobj.mailCreateFamily(req, res, password);
            return res
            .status(200)
            .json({"message": "", "data": password });
        }
    })
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "email或密碼未填", "data": "" });
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log(err);
            return res
                .status(404)
                .json({ "message": err, "data": "" });
        }
        if (user) {
            const token = user.generateJwt();
            Fmly.findById(user.familycode, (err, row) => {
                console.log(user);
                if (row) {
                    let loginOK = {
                        "token": token,
                        "familycode": user.familycode,
                        "familyname": row.familyname,
                        "name": user.name,
                        "role": row.email === user.email ? "admin" : "user",
                        "email": user.email
                    };
                    //Pays.findOne({}, {}, { sort: { 'created_at': -1 } }, function (err, myPay) {
                    Pays.findOne({familycode:user.familycode}, { sort: { 'created_at': -1 } }, function (err, myPay) {
                        if (myPay) {
                            console.log(myPay);
                            loginOK.paytype = myPay.paytype;
                            loginOK.paid = myPay.NewOrderPaid(myPay.duedate);
                            loginOK.duedate = myPay.duedate;
                            res.status(200)
                                .json({
                                    "message": "", "data": JSON.stringify(loginOK)
                                });

                        } else {
                            loginOK.paytype = '';
                            loginOK.paid = 'N';
                            loginOK.duedate = '';
                            console.log(loginOK);
                            res.status(200)
                                .json({
                                    "message": "", "data": JSON.stringify(loginOK)
                                });
                        }
                    });
                } else {
                    res
                        .status(402)
                        .json({ "message": 'Email未被加入家庭無法使用系統', "data": "" });
                }
            });
        } else if (info.message === 'badpassword') {
            res
                .status(402)
                .json({ "message": info.message, "data": "" });
        } else {
            console.log(info.message);
            res
                .status(402)
                .json({ "message": info.message, "data": "" });
        }
    })(req, res);
};

// const isuser = (req, res) => {
//     //console.log(req.body.name);
//     if (!req.body.name) {
//         return res
//             .status(400)
//             .json({ "message": "帳號欄位必填" });
//     } else {
//         User.isUserExist(req.body.name, (done, message) => {
//             res.status(200).json(done);
//         });
//     }
// }

// const str2base64 = (str) => {
//     return base64encode(str);
// }



module.exports = {
    register,
    register2,
    login
    //,isuser
};