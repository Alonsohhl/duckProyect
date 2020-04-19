module.exports = function (sequelize, DataTypes) {
  var Park = sequelize.define('park', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ACTIVE'
    }
  })

  Park.associate = function (models) {
    models.food.hasMany(models.dataFed, { foreignKey: 'id_park' })
  }

  return Park
}
