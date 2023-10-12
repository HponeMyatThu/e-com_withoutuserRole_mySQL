const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-udemy", "root", "Admin12!@", {
  dialect: "mysql",
  host: "localhost",
});

sequelize.sync()
  .then(() => {
    console.log("Users table has been created (if it didn't exist).");
  })
  .catch(error => {
    console.error("Error creating users table:", error);
  });


module.exports = sequelize;
