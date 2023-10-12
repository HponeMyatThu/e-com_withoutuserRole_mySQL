const http = require("http");
const port = 3000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const get404 = require("./controllers/errorController");
const sequelize = require("./utils/database");

const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const CartItem = require("./models/Cart-items");
const Order = require("./models/order");
const OrderItem = require("./models/Order-items");

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

app.set("view engine", "ejs");

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

sequelize
  //.sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "max", email: "max@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    if (!user) {
      return res.redirect("/err");
    }
    return user.createCart();
  })
  .then((result) => {
    app.listen(port, "localhost", () => {
      console.log(`listen in http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res, next) => {
  res.redirect("/admin/edit-product");
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(get404.get404Page);
