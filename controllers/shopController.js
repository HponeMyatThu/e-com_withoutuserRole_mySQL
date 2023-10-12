const Product = require("../models/Product");
const Cart = require("../models/Cart");
const CartItem = require("../models/Cart-items");

exports.postOrder = (req, res, next) => {
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      req.user
        .createOrder()
        .then((order) => {
          return order.addProduct(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      return fetchCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/order");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrder = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/order", {
        pageTitle: "Order",
        path: "/order",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getShowProduct = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/show-products", {
        pageTitle: "Show Product List",
        path: "/show-products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDecreaseItem = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchCart;
  let quantity;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        const numberOldQuantity = Number(oldQuantity);
        let newQuantity = numberOldQuantity - 1;
        quantity = newQuantity;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchCart.addProduct(product, {
        through: { quantity: quantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postIncreaseItem = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchCart;
  let quantity;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        const numberOldQuantity = Number(oldQuantity);
        let newQuantity = numberOldQuantity + 1;
        quantity = newQuantity;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchCart.addProduct(product, {
        through: { quantity: quantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        return res.redirect("/err");
      }
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return CartItem.destroy({ where: { id: product.cartItem.id } });
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/cart");
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        return res.redirect("/err");
      }
      return cart
        .getProducts()
        .then((product) => {
          if (!product) {
            return res.redirect("/err");
          }
          res.render("shop/cart", {
            pageTitle: "Cart",
            path: "/cart",
            products: product,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        const numberOldQuantity = Number(oldQuantity);
        newQuantity = numberOldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDetailProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/err");
      }
      res.render("shop/detail-product", {
        pageTitle: "Detail Product",
        path: "/detail-product",
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
