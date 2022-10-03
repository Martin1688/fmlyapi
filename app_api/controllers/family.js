const mongoose = require('mongoose');
//const { rawListeners } = require('../../app');
const Fmly = mongoose.model('Familys');
const User = mongoose.model('User');
const Auth = require('./authentication');
const Paid = mongoose.model('Pays');
//const https = require('https');
//const { json } = require('express');
const PORT = process.env.PORT || 3000;
//const extend = require('util')._extend;

let fHost = 'localhost';
// if (process.env.NODE_ENV === "production") {
//     fHost = 'familyaccounting.herokuapp.com'
// }

const familyCreate = (req, res) => {
     const dd = Date.now() / 1000;
    //req.body.familycode="123456";
    const mail = req.body.email;
    User.findOne({ "email": mail }, (err, row) => {
        if (row) {
            res
                .status(409)
                .json({ "message": row.email + " 已經被使用過了", "data": "" });
        }
    });

    Fmly.findOne({ "email": mail }, (err, row) => {
        if (row) {
            res
                .status(409)
                .json({ "message": row.email + " 已經被使用過了", "data": "" });
        }
    });
     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const memo=  req.body.keep === true?"保留":"不保留";//保留帳號在client的storage
   console.log(ip);
    Fmly.create({
        familyname: req.body.familyName,
        email: mail,
        macaddress: ip,
        memo: memo,
        applydate: dd
    },(err, account) => {
            if (err) {
                console.log(err);
                res
                    .status(400)
                    .json({
                        "message": err,
                        "data": ""
                    });
            } else {
                console.log(account.id);
                const fCode=account.id;
                req.body.familycode=fCode;
                Auth.register2(req, res, fCode, 'family888');
            }

        });
};

const familyQueryOne = (req, res) => {
    Fmly.findById(req.body.familycode)
        .exec((err, row) => {
            if (!row) {
                return res
                    .status(404)
                    .json({
                        "message": "查無此家庭用戶",
                        "data": ""
                    });
            } else if (err) {
                return res
                    .status(404)
                    .json({
                        "message": err,
                        "data": ""
                    });
            } else {
                return getMembers(req.body.familycode, row, res);
                // setTimeout(() => {
                //      res
                //     .status(200)
                //     .json({
                //         "message": "",
                //         "data": {"main":row,"users":data}
                //     });

                // }, 1000);
            }
        });
};

const getMembers = (fCode, data, res) => {
    User.find({ "familycode": fCode }).exec((err, rows) => {
        if (err) {
            res
                .status(200)
                .json({
                    "message": "",
                    "data": { "main": data, "users": [] }
                });
        }
        if (rows) {
            res
                .status(200)
                .json({
                    "message": "",
                    "data": { "main": data, "users": rows }
                });
        }
    })
};


const familyUpdateOne = (req, res) => {
    if (!req.body.familycode) {
        return res
            .status(404)
            .json({
                "message": "查無此家庭用戶",
                "data": ""
            });
    }
    Fmly.findById(req.body.familycode)
        .exec((err, row) => {
            if (!row) {
                return res
                    .status(404)
                    .json({
                        "message": "查無此家庭用戶",
                        "data": ""
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json({
                        "message": err,
                        "data": ""
                    });
            }
            row.familyname = req.body.familyname;

            row.save((err) => {
                if (err) {
                    res
                        .status(404)
                        .json({
                            "message": err,
                            "data": ""
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            "message": "Updated",
                            "data": row
                        });
                }
            });
        });

};

const familyDeleteOne = (req, res) => {
    const { familycode } = req.params;
    if (familycode) {
        Fmly
            .findByIdAndRemove(familycode)
            .exec((err) => {
                if (err) {
                    return res
                        .status(404)
                        .json({
                            "message": err,
                            "data": ""
                        });
                }
                res
                    .status(204)
                    .json({
                        "message": "Deleted"
                    });
            });
    } else {
        res
            .status(404)
            .json({
                "message": err,
                "data": "家庭用戶不存在"
            });
    }
};

const familyAll = (req, res) => {
    Fmly.find({}, (err, rows) => {
        if (err) {
            res.status(400)
                .json({
                    "message": err,
                    "data": ""
                });
        }
        if (rows) {
            res.status(200)
                .json({
                    "message": "ok",
                    "data": rows
                });
        } else {
            res.status(200)
                .json({
                    "message": "none of family Query.",
                    "data": []
                });

        }
    });
}

const userAll = (req, res) => {
    User.find({}, (err, rows) => {
        if (rows) {
            res.status(200)
                .json({
                    "message": "",
                    "data": rows
                })
        } else {
            res.status(400)
                .json({
                    "message": err,
                    "data": ""
                })
        }
    })
}

const familyUserAll = (req, res) => {
    console.log(req.body.familycode);
    User.find({familycode:req.body.familycode}, (err, rows) => {
        if (rows) {
            res.status(200)
                .json({
                    "message": "success",
                    "data": rows
                })
        } else if(err) {
            res.status(400)
                .json({
                    "message": err,
                    "data": ""
                })
        } else {
            res.status(400)
                .json({
                    "message": '家庭不存在',
                    "data": ""
                })

        }
    })
   
}
const familyAddUser = (req, res) => {
    return Auth.register(req, res);
}

// const familyPaid=(req,res)=>{
//     const dueday=GetDueDate(req.body.actiondate, req.body.paytype)
//     Paid.create({
//         familycode: req.body.familycode,
//         useremail: req.body.mail,
//         amount: req.body.mail,
//         discount: req.body.mail,
//         paymethod: req.body.paymethod,
//         paytype: req.body.paytype,
//         actiondate: req.body.actiondate,
//         duedate: dueday

//     },(err, account) => {
//             if (err) {
//                 console.log(err);
//                 res
//                     .status(400)
//                     .json({
//                         "message": err,
//                         "data": ""
//                     });
//             } else {
//                 console.log(account.id);
//                 res.status(200)
//                 .json({
//                     "message": "OK",
//                     "data": []
//                 });              
//             }
//         });
// };

//算到期日
const GetDueDate = function(startDay, payType){
    let datest=new Date(startDay*1000);
    if(payType === 'M'){
        datest= new Date(datest.setMonth(datest.getMonth()+1));;
    } else if(payType === 'S'){
        datest= new Date(datest.setMonth(datest.getMonth()+3));
    } else if(payType === 'Y'){
        datest= new Date(datest.setMonth(datest.getMonth()+12));
    }
    const dateok= new Date(datest.getFullYear(),datest.getMonth(), datest.getDate(), 23, 59, 59);
    return dateok.getTime()/1000;
}


module.exports = {
    familyDeleteOne,
    familyUpdateOne,
    familyQueryOne,
    familyCreate,
    familyAll,
    familyUserAll,
    userAll,
    familyAddUser
};

// //要再增加1個條件查詢功能，利用家庭用戶名稱模糊查詢