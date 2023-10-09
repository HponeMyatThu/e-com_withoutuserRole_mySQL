const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/edit-product", adminController.getAddProduct);
router.post("/edit-product", adminController.postAddProduct);
router.get("/edit-product/:productId", adminController.getEditProduct);
router.post("/edit-product", adminController.postEditProduct);
router.post("/delete-product", adminController.postDeleteProduct);
router.get("/products", adminController.getProducts);

module.exports = router;