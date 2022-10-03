const Sib = require('sib-api-v3-sdk')
const mongoose = require('mongoose');
const dns = require("dns");
const crypto = require('crypto');
const User = mongoose.model('User');
const EMAIL = process.env.EMAIL;
const sendinblueApiKey = process.env.MailAPI_KEY;
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = sendinblueApiKey;
const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender = {
    email: EMAIL,
    name: "家庭收入支出網站管理中心",
}
const receivers = [
    {
        email: '<email address>',
    },
]


const mailOfForgetPws = (req, res, password, name) => {
    const userNmae = name;
    const pws = password;
    const userMailUrl = req.body.email;
    // console.log(EMAIL);
    // console.log(userMailUrl);
    // console.log(sendinblueApiKey);
    const maildomain = userMailUrl.split('@')[1];
    dns.lookup(maildomain, (error, address, family) => {
        if (error) {
            console.log(error);
            res.status(400)
                .json({ "message": `${userMailUrl} 不存在，請用真正的email`, "data": error })

        } else {
            console.log(
                `The ip address is ${address} and the ip version is ${family}`
            );
            receivers[0].email = userMailUrl;//收件者email
            tranEmailApi
                .sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: '家庭收入支出網站用戶新密碼',
                    htmlContent: `
              <h4>貴用戶(${userNmae})的新密碼：${pws}</h4>
                      `,
                    params: {
                        role: 'Frontend',
                    },
                })
                .then(function (data) {
                    res.status(200).send({
                        "message": "success", "data": "新密碼已寄到註冊的email中"
                    });
                }, function (error) {
                    res.status(400)
                        .json({ "message": error, "data": "" })
                });
        }
    });




}

const mailCreateFamily = (req, res, password) => {
    const pws = password;
    const familyname = req.body.familyName;
    const userMailUrl = req.body.email;
    const admin = req.body.name;
    const maildomain = userMailUrl.split('@')[1];
    dns.lookup(maildomain, (error, address, family) => {
        if (error) {
            console.log(error);
            res.status(400)
                .json({ "message": `${userMailUrl} 不存在，請用真正的email`, "data": error })

        } else {
            //console.log(userMailUrl);
            receivers[0].email = userMailUrl;//收件者email
            tranEmailApi
                .sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: '家庭收入支出網站-家庭用戶建立成功通知EMAIL',
                    htmlContent: `
            <h4>家庭名稱：${familyname}</h4><h4>管理人(${admin})EMAIL：${userMailUrl}</h4><h4>管理人密碼：${pws}</h4>
                `,
                    params: {
                        role: 'Frontend',
                    },
                })
                .then(function (data) {
                    res.status(200).send({
                        "message": "", "data": ""
                    });
                }, function (error) {
                    res.status(400)
                        .json({ "message": error, "data": "" })
                });

        }


    });
}
    /// type should be 'html' or 'text'
    const mailUniversal = (req, res, mail, subject, content, type) => {
        const maildomain = mail.split('@')[1];
        dns.lookup(maildomain, (error, address, family) => {
            if (error) {
                console.log(error);
                res.status(400)
                    .json({ "message": `${userMailUrl} 不存在，請用真正的email`, "data": error })

            } else {
                receivers[0].email = mail;//收件者email
                if (type === 'html') {
                    tranEmailApi
                        .sendTransacEmail({
                            sender,
                            to: receivers,
                            subject: subject,
                            htmlContent: content,
                            params: {
                                role: 'Frontend',
                            },
                        })
                        .then(function (data) {
                            res.status(200).send({
                                "message": "success", "data": data
                            });
                        }, function (error) {
                            res.status(400)
                                .json({ "message": error, "data": "" })
                        });

                } else if (type === 'text') {
                    tranEmailApi
                        .sendTransacEmail({
                            sender,
                            to: receivers,
                            subject: subject,
                            textContent: content,
                            params: {
                                role: 'Frontend',
                            },
                        })
                        .then(function (data) {
                            res.status(200).send({
                                "message": "success", "data": data
                            });
                        }, function (error) {
                            res.status(400)
                                .json({ "message": error, "data": "" })
                        });
                }

            }

        });
    }

module.exports = {
    mailOfForgetPws,
    mailCreateFamily,
    mailUniversal
}

