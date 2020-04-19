module.exports = function (sequelize, DataTypes) {
  var Food = sequelize.define('food', {
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

  Food.associate = function (models) {
    models.food.hasMany(models.dataFed, { foreignKey: 'id_food' })
    models.food.belongsTo(models.kind, { foreignKey: 'id_kind' })
  }

  return Food
}
