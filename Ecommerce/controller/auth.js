const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require('../helper/errorHandler');
const config = require('../config/config');

exports.signUp = (req, res) => {
    const user = new User(req.body);
    
    user.save((err, user)=>{
        if(err) {
            console.log({err});
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.password = undefined;
        console.log({user});
        res.json(user)
    });
      
};

exports.signIn =(req, res) => {

    const { email, password} = req.body;
    User.findOne({email}, (error, user)=>{
        if(error|| !user){
            return res.status(400).json({
                error: "User with Email doesn't exist!!!"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error:'Email and password did not match'
            })
        }
        const token = jwt.sign({_id: user._id}, config.JWT_SECRET);

        res.cookie('t', token, {expire: new Date() + 9999 });

        const {_id, name, email, role} = user;

        return res.status(200).json({token, user: {_id, name, email, role}});
    })    
}

exports.signOut = (req, res) =>{
    res.clearCookie('t');
    res.status(200).json({
        message:'signout successful'
    })
}

exports.requireSignIn = expressJwt({
    secret: config.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}