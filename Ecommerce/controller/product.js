'use strict';

const Product = require('../models/product');
const _ = require('lodash');
const formidable = require('formidable');
const { errorHandler } = require('../helper/errorHandler');
const fs = require('fs');
exports.create = (req, res) =>{
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files)=>{
        if(err){
            res.status(400).json({
                error: errorHandler(err)
            })
        }

        const {name, description, price, category, quantity, shipping} =fields;
        
        if(!name || !description || !price || !category || !quantity){
            return res.status(400).json({
                error:"All fields are required"
            })
        }

        let product = new Product(fields);
        if(files.image){
            console.log(files.image)
            if(files.image.size> 1200000){
                return res.status(400).json({
                    error:"Image should not be more than 1mb "
                })
            }
            product.image.data = fs.readFileSync(files.image.filepath);
            product.image.contentType = files.image.mimetype;
        }
        product.save((err, data)=>{
            if(err){
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.status(201).json({
                data
            })
        })
    })
}

exports.read = (req, res) => {
    req.product.image = undefined;
    return res.json(req.product);
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let product = req.product;
        product = _.extend(product, fields);


        if (files.image) {
            if (files.image.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.image.data = fs.readFileSync(files.image.path);
            product.image.contentType = files.image.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.destroy = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Product deleted successfully'
        });
    });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * 
 */
exports.list = (req, res)=>{
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    
    Product.find()
        .select('-image')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products)=>{
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.status(200).json(products);
        })

}; 

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(categories);
    });
};

exports.listSearch = (req, res) => {
    const query = {};
    if(req.query.search){
        query.name = {$regex: req.query.search, $options: 'i'} 

        if(req.query.category && req.query.category !== 'All'){
            query.category = req.query.category
        }

        Product.find(query, (err, products)=> {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            console.log({products})
            res.status(200).json(products)
        }).select("-image")
    }

    
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-image')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.image = (req, res, next) => {
    if (req.product.image.data) {
        res.set('Content-Type', req.product.image.contentType);
        return res.send(req.product.image.data);
    }
    next();
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {productId} id 
 * @returns {obj} req.product
 */
exports.productById = (req, res, next, id)=> {
    Product.findById(id).exec((error,product)=>{
        if(error ||  !product){
            return res.status(400).json({
                error:  'Product not found'
            })
        }
        req.product = product;
        next();
    })
};