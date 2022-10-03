const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
// const jwt = require('express-jwt');
// console.log(process.env.JWT_SECRET);
// const auth = jwt({
//     secret: process.env.JWT_SECRET,
//     userProperty: 'payload',
//     algorithms: ['RS256'] 
// });
const ctrlFmlyaccount = require('../controllers/faccount');
const ctrlAuth = require('../controllers/authentication');
const ctrlPara = require('../controllers/paras');
const ctrlFamily = require('../controllers/family');
//const ctrlMail = require('../controllers/emailsendinblue');
//const ctrlMail = require('../controllers/emailsender');
const ctrlPay = require('../controllers/pays');
const ctrUser = require('../controllers/users');
const ctrlIncome = require('../controllers/incomes');
const ctrlReCaptcha = require('../controllers/recaptchservice');
const ctrlSuggest = require('../controllers/opinion');

const auth = (req, res, next) => {
    //console.log(req.headers.authorization);
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (decode)
                console.log(decode);
            next();
        });
    }

};






router
    .route('/fmaccount')
    .post(auth, ctrlFmlyaccount.accountCreate)
    .patch(auth, ctrlFmlyaccount.acntListByMonth);

router
    .route('/fmaccount/:accountid')
    .get(ctrlFmlyaccount.accountReadOne)
    .put(auth, ctrlFmlyaccount.accountUpdateOne)
    .delete(auth, ctrlFmlyaccount.accountDeleteOne);

router.post('/fmregister', ctrlFamily.familyCreate);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//router.post('/isuser', ctrlAuth.isuser);
router.post('/changePws', auth, ctrUser.userChangePws);
router.post('/forgetpws', ctrUser.userForgetPws);
router.post('/familyadduser', auth, ctrlFamily.familyAddUser);
router.post('/reCaptchaValidate', ctrlReCaptcha.verifyReCaptcha);
router.get('/listfamilies', auth, ctrlFamily.familyAll);
router.get('/listUsers', ctrlFamily.userAll);
router.post('/listFmUsers', auth, ctrlFamily.familyUserAll);
router.post('/queryafamily', auth, ctrlFamily.familyQueryOne);
router.post('/savePayRec', auth, ctrlPay.payCreate);

router.get('/paras/:paratype', ctrlPara.parasByType);
router.route('/paras')
    .patch(auth, ctrlPara.parasByName)
    .post(auth, ctrlPara.paraCreate);

router.route('/paras/:paraid')
    .delete(auth, ctrlPara.paraDeleteOne);

router.route('/fmlyuser')
    .post(auth,ctrUser.createUser)
    .patch(auth,ctrlFamily.familyUserAll)
    .put(auth,ctrUser.userUpadate);
    
router.route('/fmlyuser/:mail')
    .delete(auth,ctrUser.userDelOne);

router.route('/income')
    .post(auth,ctrlIncome.createIncome)
    .patch(auth,ctrlIncome.listIncome)
    .put(auth,ctrlIncome.updateIncome);
 
    router.route('/income/:incomeId')
    .delete(auth, ctrlIncome.delIncome);
 
    router.route('/suggest')
    .post(auth,ctrlSuggest.suggestCreate)
    .put(auth,ctrlSuggest.suggestUpdate)
    .patch(auth,ctrlSuggest.suggestQuery);

   router.route('/suggest/:idKey')
   .delete(auth, ctrlSuggest.suggestDelete);
   
router.route('/')

module.exports = router;