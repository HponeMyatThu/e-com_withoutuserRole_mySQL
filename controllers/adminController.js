const express = require("express");
const Product = require("../models/Product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
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

  console.log("IN ADD PRODUCT");
  req.user.createProduct({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
  })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Product List",
        path: "/products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const updatedProdId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedDes = req.body.description;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;

  Product.findByPk(updatedProdId)
    .then((product) => {
      if (!product) {
        return res.redirect("/err");
      }
      (product.title = updatedTitle),
        (product.description = updatedDes),
        (product.price = updatedPrice),
        (product.imageUrl = updatedImageUrl);
      return product.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if(!product){
        return res.redirect("/err");
      }
      return product.destroy();
    })
    .then(result =>{
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

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
  console.log("file: adminController.js:79 ~ prodId:", prodId);
  //Product.findByPk(prodId)
  req.user.getProducts({where:{id:prodId}})
    .then((products) => {
      const product = products[0];
      if (!products) {
        return res.redirect("/err");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
