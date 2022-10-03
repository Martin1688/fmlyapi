const mongoose = require('mongoose');
const Opiniols = mongoose.model('opiniols');
const User = mongoose.model('User');

const suggestCreate = (req, res) => {
    //const dd = Date.now() / 1000;
    const mail = req.body.email;
    //console.log(mail);
    User.findOne({ "email": mail }, (err, row) => {
        if (err) {
            res.status(409)
                .json({ "message": row.email + "不是用戶不接受意見", "data": "" });
        }
        Opiniols.create({
            email: mail,
            advice: req.body.advice,
            explain: req.body.explain,
            dttime: req.body.dttime,
            ans: '',
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            username: req.body.username
        }, (err, row) => {
            //console.log(row);
            if (row) {
                res.status(200)
                    .json({
                        "message": '',
                        "data": row
                    });
            } else if (err) {
                console.log(err);
                res.status(400)
                    .json({
                        "message": err,
                        "data": {}
                    });
            } else {
                res.status(201)
                    .json({
                        "message": '',
                        "data": {}
                    });
            }
        });
    });
};

suggestUpdate = (req, res) => {
    const idKey = req.body._id;
    //console.log(idKey);
    Opiniols.findOne({ "_id": idKey }, (err1, row) => {
        if (err1) {
            res.status(400)
                .json({
                    "message": err,
                    "data": ""
                });
        } else {
            row.explain = req.body.explain;
            row.advice = req.body.advice;
            row.save((err, rw) => {
                if (err) {
                    res.status(404)
                        .json({
                            "message": err,
                            "data": ""
                        });
                } else {
                    res.status(200)
                        .json({
                            "message": "",
                            "data": rw
                        });
                }
            });
        }
    });
}

suggestQuery = (req, res) => {
    Opiniols.find({}).exec((err, rows) => {
        if (err) {
            res.status(400)
                .json({
                    "message": err,
                    "data": []
                });
        }
        if (rows) {
            res.status(200)
                .json({
                    "message": "",
                    "data": rows
                });
        } else {
            res.status(400)
                .json({
                    "message": "查無意見資料",
                    "data": []
                });

        }
    });

};

suggestDelete = (req, res) => {
    const { idKey } = req.params;
    // console.log(idKey);
    Opiniols
        .findByIdAndRemove(idKey)
        .exec((err) => {
            if (err) {
                return res
                    .status(404)
                    .json({
                        "message": err,
                        "data": ""
                    });
            } else {
                res.status(200)
                    .json({
                        "message": "Deleted",
                        "data": ""
                    });
            }
        })
}


module.exports = {
    suggestCreate,
    suggestQuery,
    suggestUpdate,
    suggestDelete
};