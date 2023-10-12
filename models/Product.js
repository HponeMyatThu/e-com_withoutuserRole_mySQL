const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Product = sequelize.define('products',{
  id:{
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  title:{
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl:{
    type: Sequelize.STRING,
    allowNull: false
  },
  description:{
    type: Sequelize.STRING,
    allowNull:false
  },price:{
    type: Sequelize.STRING,
    allowNull:false
  }
})

module.exports = Product;