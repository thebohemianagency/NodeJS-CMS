const express = require('express');
const router = express.Router();
const productController = require(`${__dirname}/../controller/productController.js`);
const adminController = require(`${__dirname}/../controller/adminController.js`);

//all product in categories + pagination + sorting
router.route('/')
    .get(productController.getAllProducts)

router.route('/:id')
    .delete(productController.deleteProduct)
//list of product categories
router.route('/categories')
    .get(productController.getAllProducts)
//get single skus
router.route('/sku/:id')
    .get(productController.getSKU)
//create order
router.route('/order')
    .post(productController.createOrder)
//checkout
router.route('/checkout')
    .post(productController.checkOut)
//get skus by producy
router.route('/sku/get/:prodid')
    .get(productController.getAllSKUs)

//get all coupons
router.route('/coupons')
    .get(productController.listCoupons)

module.exports = router;