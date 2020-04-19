module.exports = function (sequelize, DataTypes) {
  var Schedule = sequelize.define('schedule', {
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW
    },
    frequencyType: {
      type: DataTypes.ENUM('daily'), //, 'weekly', 'weekly', 'fixed', 'yearly'
      allowNull: true,
      defaultValue: 'daily'
    },
    // frequency: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   get() {
    //     return this.getDataValue('frequency').split(';')
    //   },
    //   set(val) {
    //     this.setDataValue('frequency', val.join(';'))
    //   }
    // },
    Frequencyinterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ACTIVE'
    }
  })

  Schedule.associate = function (models) {
    models.schedule.belongsTo(models.dataFed, { foreignKey: 'id_dataFed' })
  }

  return Schedule
}
