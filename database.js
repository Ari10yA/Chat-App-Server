const { Pool } = require("pg");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ChatApp", "postgres", "Aritya@123", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
  })
  .catch((err) => {});

// const query = (text, params) => pool.query(text, params);

// module.exports = query;

module.exports = sequelize;
