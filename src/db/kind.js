module.exports = function (sequelize, DataTypes) {
  var Kind = sequelize.define('kind', {
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

  Kind.associate = function (models) {
    models.food.hasMany(models.food, { foreignKey: 'id_kind' })
  }

  return Kind
}
