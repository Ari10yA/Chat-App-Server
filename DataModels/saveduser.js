const sequelize = require('../database');
const {DataTypes} = require('sequelize')

const SavedUser = sequelize.define('SavedUser', {
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
    },
    users: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true
    }
});

module.exports = SavedUser;