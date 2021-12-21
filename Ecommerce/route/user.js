'use strict';

const router = require('express').Router();
const { requireSignIn, isAuth, isAdmin } = require('../controller/auth');
const { userById, update, purchaseHistory } = require('../controller/user');
router.param('user_id', userById);
router.get('/test/:user_id', requireSignIn, isAuth, (req, res)=>{
    res.json({
        user: req.profile
    })
} )

router.put('/user/:user_id', requireSignIn, isAuth, update);
router.get('/orders/user/:user_id', requireSignIn, isAuth, purchaseHistory);
module.exports = router;