'use strict';

const router = require('express').Router();
const { requireSignIn, isAuth, isAdmin } = require('../controller/auth');
const { create, productById, list, read,update, destroy, listRelated, listSearch, listBySearch, listCategories, image } = require('../controller/product');
const { userById } = require('../controller/user');

router.post('/product/create/:user_id', requireSignIn, isAuth, isAdmin, create);
router.get("/product/:product_id", read);
router.delete(
    "/product/:product_id/:user_id",
    requireSignIn,
    isAuth,
    isAdmin,
    destroy
);
router.put(
    "/product/:product_id/:user_id",
    requireSignIn,
    isAuth,
    isAdmin,
    update
);
router.get('/products', list);
router.get("/products/search", listSearch);
router.get('/product/related/:product_id', listRelated);
router.get("/products/categories", listCategories);
router.get("/product/image/:product_id", image);
router.post("/products/search", listBySearch);


router.param('user_id', userById);
router.param('product_id', productById);

module.exports = router;