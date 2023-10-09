const express = require("express");
const Product = require("../models/Product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Admin Add Product",
    path: "/edit-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();

  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      pageTitle: "Admin Product List",
      path: "/products",
      prods: products,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const updatedProdId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedDes = req.body.description;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;

  const updatedProduct = new Product(
    updatedProdId,
    updatedTitle,
    updatedDes,
    updatedPrice,
    updatedImageUrl
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) =>{
 const prodId = req.body.productId;
 Product.deleteById(prodId);
 res.redirect("/admin/products");
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/admin/edit-product", {
      pageTitle: "Add Product",
      path: "/add-product",
      editing: false,
    });
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/admin/edit-product", {
        pageTitle: "Add Product",
        path: "/add-product",
        editing: false,
      });
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/edit-product",
      editing: editMode,
      product: product,
    });
  });
};
