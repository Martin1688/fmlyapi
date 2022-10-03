const mongoose = require('mongoose');
//const { rawListeners } = require('../../app');
const Fmly = mongoose.model('Familys');
const User = mongoose.model('User');
const income = mongoose.model('Incomes')

const listIncome = (req, res) => {
    income.find({ familycode: req.body.familycode, yearmonth: req.body.yearmonth }, (err, rows) => {
        if (err) {
            res.status(400).json({
                "message": err.message,
                "data": ""
            });
            return;
        } else if(rows){
            res.status(200)
            .json({
                "message": "success",
                "data": rows
            })
        } else {
            res.status(401).json({
                "message": req.body.yearmonth+'無收入記錄',
                "data": ""
            });
             
        }
    });
};

const updateIncome = (req, res) => {
    const dd = Date.now() / 1000;
    income.findById(req.body.incomeId)
        .exec((err, row) => {
            if (!row) {
                return res
                    .status(404)
                    .json({
                        "message": '查無紀錄，無法更新',
                        "data": ""
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json({
                        "message": err.message,
                        "data": ""
                    });
            }
            row.familycode = req.body.familycode;
            row.useremail = req.body.useremail;
            row.incometitle = req.body.incometitle;
            row.amount = req.body.amount;
            row.yearmonth = req.body.yearmonth;
            row.updatedate = dd;

            row.save((err) => {
                if (err) {
                    res
                        .status(404)
                        .json({
                            "message": err.message,
                            "data": ""
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            "message": "success",
                            "data": ""
                        });
                }
            });
        });
};
const createIncome = (req, res) => {
    //console.log(req.body.familycode);
    const dd = Date.now() / 1000;
    Fmly.findById(req.body.familycode).exec((err, row) => {
        if (!row) {
            return res
                .status(400)
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
        } else {
            User.findOne({ email: req.body.useremail, familycode: req.body.familycode }, (err, row) => {
                if (err) {
                    console.log(err);
                    res
                        .status(400)
                        .json({
                            "message": err.message,
                            "data": ""
                        });
                } else if (!row) {
                    res
                        .status(400)
                        .json({
                            "message": "尚未註冊為家庭成員無法使用",
                            "data": ""
                        });
                } else {
                    //console.log(req.body);
                    income.create({
                        familycode: req.body.familycode,
                        useremail: req.body.useremail,
                        incometitle: req.body.incometitle,
                        amount: req.body.amount,
                        yearmonth: req.body.yearmonth,
                        updatedate: dd
                    }, (err, rowi) => {
                        if (err) {
                            console.log(err);
                            res
                                .status(400)
                                .json({
                                    "message": err.message,
                                    "data": ""
                                });
                        } else if (rowi) {
                            //console.log(rowi);
                            res
                                .status(200)
                                .json({
                                    "message": "success",
                                    "data": rowi
                                });
                        }
                        // });
                        // // res
                        // // .status(204)
                        // // .json({
                        // //     "message": "ok",
                        // //     "data": []
                        // // });

                    }
                    );
                }

            })
        }
    });
}

const delIncome = (req, res) => {
    const { incomeId } = req.params;
    //console.log(req.params);
    if (incomeId) {
        income.findByIdAndRemove(incomeId)
            .exec((err) => {
                if (err) {
                    return res
                        .status(404)
                        .json({
                            "message": err.message,
                            "data": ""
                        });
                }
                res
                    .status(200)
                    .json({
                        "message": "success",
                        "data": ""
                    });
            });
    } else {
        res
            .status(400)
            .json({
                "message": '查無紀錄，無法刪除',
                "data": ""
            });
    }
};


module.exports = {
    listIncome,
    createIncome,
    updateIncome,
    delIncome
}