const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get("/show-products", shopController.getShowProduct);
router.get("/detail-product/:productId", shopController.postDetailProduct);
router.post("/cart", shopController.postAddCart);
router.get("/cart", shopController.getCart);
router.post("/cart-delete-item", shopController.postCartDelete);

module.exports = router;