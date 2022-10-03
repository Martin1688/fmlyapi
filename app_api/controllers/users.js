const mongoose = require('mongoose');
const Fmly = mongoose.model('Familys');
const User = mongoose.model('User');
const ctrlMail = require('../controllers/emailsendinblue');

const Auth = require('./authentication');


const createUser = (req, res) => {
    //console.log(req.body);
    if (!req.body.name) {
        return res
            .status(400)
            .json({ "message": "姓名未填", "data": "" });
    } else if (!req.body.email) {
        return res
            .status(400)
            .json({ "message": "Email未填", "data": "" });
    } else if (!req.body.familycode) {
        return res
            .status(400)
            .json({ "message": "須由家庭財務管理人員登入取得家庭代碼才能新增成員", "data": "" });
    }
    const fCode = req.body.familycode;

    Auth.register2(req, res, fCode, 'family888');
}
//判斷user角色是否為admin的方法，如果user.email ===family.email則user為admin否則為member
// const QueryUsers = (req, res) =>{
//     //console.log(req.body);
//     if (!req.body.familycode) {
//         return res
//             .status(400)
//             .json({ "message": "須由家庭財務管理人員登入取得家庭代碼才能新增成員", "data": "" });
//     }
//     const fCode =  req.body.familycode;

// }

const userChangePws = (req, res) => {
    const msg ='';
    if(!req.body.email){
        msg+='email未填;'
    }
    if(!req.body.oldPassword){
        msg+='舊密碼未填;'
    }
    if(!req.body.password){
        msg+='新密碼未填;'
    }
    if(msg !==''){
        res
            .status(400)
            .json({ "message": msg, "data": "" });
    } else {
        User.findOne({ email: req.body.email }, (err, row) => {
            if (err) {
                res.status(400)
                    .json({
                        "message": err,
                        "data": ""
                    });
            }
            if (row) {
                const pws = req.body.password;

                row.setPassword(pws);
                row.save((err) => {
                    if (err) {
                    console.log(err);
                        res
                            .status(409)
                            .json({ "message": " 重設密碼失敗;"+err, "data": ""  });
                    } else {
                        res
                        .status(200)
                        .json({ "message": msg, "data": `密碼已更新為(${pws})` });
            
                    }
                })
            } else {
                res.status(401)
                    .json({
                        "message": "email不正確或email尚未註冊",
                        "data": ""
                    });

            }
        });        
    }
}

const userUpadate = (req, res) => {
    const msg ='';
    if(!req.body.email){
        msg+='email未填;'
    }
    if(!req.body.name){
        msg+='姓名未填;'
    }
    if(msg !==''){
        res
            .status(400)
            .json({ "message": msg, "data": "" });
    } else {
        User.findOne({ email: req.body.email }, (err, row) => {
            if (err) {
                res.status(400)
                    .json({
                        "message": err,
                        "data": ""
                    });
            }
            if (row) {
                row.name=req.body.name; 
                
                row.save((err) => {
                    console.log(err);
                    if (err) {
                        res
                            .status(409)
                            .json({ "message": " 更新失敗;"+err, "data": ""  });
                    } else {
                        //console.log(row);
                        res
                        .status(200)
                        .json({ "message": '', "data": `已更新` });
            
                    }
                })
            } else {
                res.status(401)
                    .json({
                        "message": "email不正確或email尚未註冊",
                        "data": ""
                    });

            }
        });        
    }
}



const userForgetPws = (req, res) => {
    if (!req.body.email) {
        res
            .status(400)
            .json({ "message": "email未填", "data": "" });
    } else {
        User.findOne({ email: req.body.email }, (err, row) => {
            if (err) {
                res.status(400)
                    .json({
                        "message": err,
                        "data": ""
                    });
            }
            if (row) {
                //const pws = crypto.randomBytes(5).toString('hex').toUpperCase();
                const pws = "family168";

                row.setPassword(pws);
                row.save((err) => {
                    console.log(err);
                    if (err) {
                        res
                            .status(409)
                            .json({ "message": " 重設密碼失敗", "data": err });
                    } else {
                        //const pws = crypto.randomBytes(5).toString('hex').toUpperCase();
                        const pws = "family168";
                        ctrlMail.mailOfForgetPws(req, res, pws, row.name);
                        //const token = user.generateJwt();
                        // res
                        //     .status(200)
                        //     .json({ "message": "", "data": "" });
                    }
                })
            } else {
                res.status(401)
                    .json({
                        "message": "email不正確或email尚未註冊",
                        "data": []
                    });

            }
        });
    }
}

const userDelOne = (req, res) => {
    const { mail } = req.params;
    if (!mail) {
        res.status(400)
            .json({ "message": "email未填", "data": "" });
    } else {
        User.findOneAndDelete({ email: mail }, function (err, docs) {
            if (err) {
                res.status(400)
                    .json({ "message": err, "data": "" });
            }
            else {
                res.status(200)
                    .json({ "message": "", "data": "" });
            }

        });
    }
}

module.exports = {
    createUser,
    userForgetPws,
    userDelOne,
    userChangePws,
    userUpadate
};