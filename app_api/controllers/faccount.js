// const db = require("../models/db.js")
const mongoose = require('mongoose');
const Fma = mongoose.model('Fmaccount');
const User = mongoose.model('User');


const acntListByMonth = (req, res) => {
    User.findOne({familycode: req.body.familycode }, (err, row) => {
        if (err) {
            console.log(err);
            res
                .status(400)
                .json({
                    "message": err,
                    "data": ""
                });
        }
        else if (!row) {
            res
                .status(400)
                .json({
                    "message": "尚未註冊為家庭成員無法使用",
                    "data": ""
                });
        }
        else if (row.familycode) {
            Fma.find({ cyear: req.body.cyear, cmonth: req.body.cmonth, familycode: req.body.familycode }, (err, rows) => {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                //console.log(rows);
                res
                    .status(200)
                    .json({
                        "message": "success",
                        "data": rows
                    })

            });
        }
    });
};

const accountCreate = (req, res) => {
    const dd = Date.now() / 1000;
    //console.log(req.body);
    User.findOne({ email: req.body.useremail, familycode: req.body.familycode }, (err, row) => {
        if (err) {
            console.log(err);
            res
                .status(400)
                .json({
                    "message": err,
                    "data": ""
                });
        }
        else if (!row) {
            res
                .status(400)
                .json({
                    "message": "尚未註冊為家庭成員無法使用",
                    "data": ""
                });
        }
        else if (row.familycode) {
            Fma.create({
                familycode: row.familycode,
                useremail: req.body.useremail,
                itemName: req.body.itemName,
                price: req.body.price,
                memo: req.body.memo,
                cyear: req.body.cyear,
                cmonth: req.body.cmonth,
                cday: req.body.cday,
                itemtype: req.body.itemtype,
                locate: req.body.locate,
                shop: req.body.shop

            }, (err, account) => {
                if (err) {
                    console.log(err);
                    res
                        .status(400)
                        .json({
                            "message": err,
                            "data": ""
                        });
                } else {
                    console.log(account);
                    res
                        .status(200)
                        .json({
                            "message": "Created",
                            "data": account
                        });
                }
            });
        } else {
            res
                .status(400)
                .json({
                    "message": "尚未註冊家庭無法使用",
                    "data": ""
                });

        }
    });

};

const accountReadOne = (req, res) => {
    Fma
        .findById(req.params.accountid)
        .exec((err, rows) => {
            if (!rows) {
                return res
                    .status(404)
                    .json({ "message": "account not found" });
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            } else {
                return res
                    .status(200)
                    .json(rows);
            }
        });
};

const accountUpdateOne = (req, res) => {
    if (!req.params.accountid) {
        return res
            .status(404)
            .json({
                "message": "accountid is required"
            });
    }
    Fma.findById(req.params.accountid)
        .exec((err, row) => {
            if (!row) {
                return res
                    .status(404)
                    .json({
                        "message": "accountid not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json({ "message": err });
            }
            row.itemName = req.body.itemName;
            row.price = req.body.price;
            row.memo = req.body.memo;
            row.cmonth = req.body.cmonth;
            row.cyear = req.body.cyear;
            if (req.body.cday) {
                row.cday = req.body.cday;
            }
            if (req.body.itemtype) {
                row.itemtype = req.body.itemtype;
            }
            if (req.body.locate) {
                row.locate = req.body.locate;
            }
            if (req.body.shop) {
                row.shop = req.body.shop;
            }
            row.save((err) => {
                if (err) {
                    res
                        .status(404)
                        .json({ "message": err });
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

const accountDeleteOne = (req, res) => {
    const { accountid } = req.params;
    if (accountid) {
        Fma
            .findByIdAndRemove(accountid)
            .exec((err) => {
                if (err) {
                    return res
                        .status(404)
                        .json({
                            "message": err
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
                "message": "No Account found"
            });
    }
};
module.exports = {
    acntListByMonth,
    accountCreate,
    accountReadOne,
    accountUpdateOne,
    accountDeleteOne
};