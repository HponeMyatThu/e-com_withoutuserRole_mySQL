const fs = require("fs");
const path = require("path");
const Cart = require("../models/Cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "product.json"
);

const getProductFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductFromFile((product) => {
      if (this.id) {
        const existingIndex = product.findIndex((prod) => {
          prod.id === this.id;
        });
        const updatedProduct = [...product];
        updatedProduct[existingIndex] = this; //this mean updated product

        fs.writeFile(p, JSON.stringify(product), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        product.push(this); //this mean new product
        fs.writeFile(p, JSON.stringify(product), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProduct = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if (err) {
         console.log('err =>', err)
        }
        Cart.deleteProduct(id, product.price);
      });
    });
  }

  static fetchAll(cb) {
    getProductFromFile(cb);
  }

  static findById(id, cb) {
    getProductFromFile((product) => {
      const prod = product.find((p) => p.id === id);
      cb(prod);
    });
  }
};
