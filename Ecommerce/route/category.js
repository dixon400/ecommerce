'use strict';

const router = require('express').Router();
const { requireSignIn, isAuth, isAdmin } = require('../controller/auth');
const { create, categoryById, list, read, update, destroy } = require('../controller/category');
const { userById } = require('../controller/user');

router.post('/category/create/:user_id', requireSignIn, isAdmin, create);
router.get('/category/:category_id', read);
router.put('/category/:category_id/:user_id', requireSignIn, isAuth, isAdmin, update);

router.delete('/category/:category_id/:user_id', requireSignIn, isAuth, isAdmin, destroy);
router.get('/categories', list);

router.param('category_id', categoryById);
router.param('user_id', userById);

module.exports = router;