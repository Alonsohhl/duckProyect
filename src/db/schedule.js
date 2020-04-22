module.exports = function (sequelize, DataTypes) {
  var Schedule = sequelize.define('schedule', {
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW
    },
    frequencyType: {
      type: DataTypes.ENUM('daily', 'weekly', 'custom'), //, 'weekly', 'weekly', 'fixed', 'yearly'
      allowNull: true,
      defaultValue: 'daily'
    },
    customFrequency: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        return this.getDataValue('frequency').split(';')
      },
      set(val) {
        this.setDataValue('frequency', val.join(';'))
      },
      defaultValue: null
    },
    // Frequencyinterval: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0
    // },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ACTIVE'
    }
  })

  Schedule.associate = function (models) {
    // models.schedule.belongsTo(models.dataFed, { foreignKey: 'id_dataFed' })
    models.schedule.hasMany(models.dataFed, {
      foreignKey: {
        name: 'id_schedule',
        allowNull: true
      }
    })
  }

  return Schedule
}
