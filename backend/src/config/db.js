const { Sequelize } = require("sequelize");

const db = new Sequelize("vetfarm", "root", "FJZB365FJB@#", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

module.exports = db;
