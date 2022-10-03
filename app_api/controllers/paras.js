const mongoose = require('mongoose');
const Paras = mongoose.model('Paras');



const parasByType = (req, res) => {
    Paras.find({ paraType: req.params.paratype }, (err, rows) => {
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

};


const parasByName = (req, res) => {
    Paras.find({ paraType: req.body.paraType, paraName: req.body.paraName }, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (rows === null || rows.length === 0) {
            res.status(200)
                .json({
                    "message": "success",
                    "data": [{
                        "paraType": req.body.paraType,
                        "paraName": req.body.paraName,
                        "paraText": "",
                        "paraNo": 0,
                        "paraMemo": "",
                    }]
                })
        } else {
            res.status(200)
                .json({
                    "message": "success",
                    "data": rows
                })
        }
    });
};

//如果參數已存在就直接更新
const paraCreate = (req, res) => {
    //console.log(req.body);
    Paras.find({ paraType: req.body.paraType, paraName: req.body.paraName, paraMemo: req.body.paraMemo }, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        } else if (rows.length > 0) {
            let row = rows[0];
            row.paraText = req.body.paraText;
            row.paraNo = parseInt(req.body.paraNo);
            row.paraMemo = req.body.paraMemo;
            row.save((err) => {
                if (err) {
                    res
                        .status(404)
                        .json(err);
                } else {
                    res
                        .status(200)
                        .json({
                            "message": "Updated",
                            "data": row
                        });
                }
            });
        } else {
            Paras.create({
                paraType: req.body.paraType,
                paraName: req.body.paraName,
                paraText: req.body.paraText,
                paraNo: parseInt(req.body.paraNo),
                paraMemo: req.body.paraMemo
            }, (err, row) => {
                if (err) {
                    console.log(err);
                    res
                        .status(400)
                        .json(err);
                } else {
                    res
                        .status(200)
                        .json({
                            "message": "Created",
                            "data": row
                        });
                }
            });
        }
    });
};

const paraDeleteOne = (req, res) => {
    const { paraid } = req.params;
    if (paraid) {
        Paras.findByIdAndRemove(paraid)
            .exec((err) => {
                if (err) {
                    return res
                        .status(404)
                        .json(err);
                }
                res.status(204)
                    .json({
                        "message": "deleted"
                    });
            });
    } else {
        res.status(404)
            .json({
                "message": "參數不存在"
            });
    }
};

module.exports = {
    parasByType,
    parasByName,
    paraCreate,
    paraDeleteOne
};