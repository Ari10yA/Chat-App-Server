const { Pool } = require('pg');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ChatApp', 'postgres', 'Aritya@123', {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.authenticate()
.then(() => {
    console.log('connection established');
    sequelize.sync();
})
.catch(err => {
    console.log('connection unsuccessful');
})

// const query = (text, params) => pool.query(text, params);

// module.exports = query;

module.exports = sequelize