'use strict';

const router = require('express').Router();
const { requireSignIn, isAuth, isAdmin } = require('../controller/auth');
const { userById } = require('../controller/user');
router.param('user_id', userById);
router.get('/test/:user_id', requireSignIn, isAuth, (req, res)=>{
    res.json({
        user: req.profile
    })
} )
module.exports = router;