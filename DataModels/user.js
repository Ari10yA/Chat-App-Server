const sequelize = require('../database');
const {DataTypes} = require('sequelize')

const User = sequelize.define('User', {
    sessionID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isConnected: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = User;