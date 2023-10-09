const http = require("http");
const port = 3000;
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const get404 = require("./controllers/errorController");

app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
  res.redirect("/admin/edit-product");
});

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static("public"));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(get404.get404Page);

app.listen(port, "localhost", () => {
  console.log(`listen in http://localhost:${port}`);
});
