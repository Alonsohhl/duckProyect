var bcrypt = require('bcryptjs')
// const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/envConfig')

module.exports = function (sequelize, DataTypes) {
  var dataFed = sequelize.define('dataFed', {
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW
    },
    quantityDucks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    quantityFood: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ACTIVE'
    }
    // --agrega schedule
    // recurrent: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true
    // },
  })

  dataFed.associate = function (models) {
    models.dataFed.belongsTo(models.user, { foreignKey: 'id_user' })
    models.dataFed.belongsTo(models.food, { foreignKey: 'id_food' })
    models.dataFed.belongsTo(models.park, { foreignKey: 'id_park' })
    models.dataFed.belongsTo(models.schedule, {
      foreignKey: {
        name: 'id_schedule',
        allowNull: true
      }
    })

    // models.dataFed.hasOne(models.schedule, { foreignKey: 'id_dataFed' })
  }

  return dataFed
}
