const sequelize = require('../database');
const {DataTypes} = require('sequelize')

const Message = sequelize.define('Message', {
    fromID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    toID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    msgs: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true
    }
});

module.exports = Message;