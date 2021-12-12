const router = require('express').Router();
const { signIn, signOut, signUp, requireSignIn} = require('../controller/auth');
const {userSignupValidator} = require('../validator');

router.post('/signup', userSignupValidator, signUp);
router.post('/login', signIn);
router.get('/signout', signOut);
router.get('/hello', requireSignIn, (req, res)=>{
    res.json("Hello here")
})

module.exports = router;