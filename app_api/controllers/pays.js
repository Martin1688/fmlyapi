const mongoose = require('mongoose');
const Fmly = mongoose.model('Familys');
const Paid = mongoose.model('Pays');

const payCreate = (req, res) => {
    //const dd = Date.now() / 1000;
    //console.log(req.body.familycode);
    Fmly.findById(req.body.familycode)
        .exec((err, row) => {
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
                //console.log(row);
                Paid.create({
                    familycode:req.body.familycode,
                    useremail:req.body.email,
                    amount:req.body.amount,
                    discount:req.body.discount,
                    paymethod:req.body.paymethod,
                    paytype:req.body.paytype,
                    actiondate:req.body.actiondate,
                    duedate:req.body.duedate
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
                        //console.log(account);
                        res.status(200)
                            .json({
                                "message": "Created",
                                "data": account
                            });
                    }
                })
            }
        });

}

module.exports = {
    payCreate
}