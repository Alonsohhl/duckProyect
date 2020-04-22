const router = require('express').Router()
var db = require('../../db')
const Sequelize = require('sequelize')
var moment = require('moment')

const op = Sequelize.Op

router.post('/insert', (req, res, next) => {
  const {
    body: { data: dataSchedule }
  } = req
  var fedsBulkModel = []

  db.sequelize.transaction(async (t) => {
    try {
      scheduleModel = await db.schedule.create(dataSchedule, t)
      fedModel = await db.dataFed.findByPk(dataSchedule.id_fed)

      fedsBulkModel = getBulkModel(scheduleModel, fedModel, dataSchedule)
      await db.dataFed.bulkCreate(fedsBulkModel)

      return res.status(200).json({ status: 'Schedule Inserted', id: scheduleModel.id })
    } catch (err) {
      if (!err.errors) return res.status(400).json(err)
      return res.status(400).json(err.errors)
    }
  })
})

function getBulkModel(scheduleModel, fedModel, dataSchedule) {
  var fedTime = fedModel.dataValues.time
  var fedsBulkModel = []
  var diffDates = moment(scheduleModel.endDate).diff(fedModel.dataValues.time, 'days')

  for (let i = 0; i < diffDates; i++) {
    if (dataSchedule.frequencyType === 'daily') {
      fedTime = moment(fedTime).add(1, 'days')
    }
    if (dataSchedule.frequencyType === 'weekly') {
      fedTime = moment(fedTime).add(7, 'days')
    }
    if (dataSchedule.frequencyType === 'custom') {
      fedTime = moment(fedTime).add(1, 'days')
      while ([0, 1, 2, 3, 4, 5, 6].indexOf(fedTime.days()) < 1) {
        console.log('continue') // ! cambiar el array de arriba por los dias elegitos recordar que 0 es domingo y 6 e sabado
      }
    }
    fedsBulkModel.push({
      time: fedTime,
      // time: '2020-04-16 14:33:33',
      quantityDucks: fedModel.quantityDucks,
      quantityFood: fedModel.quantityFood,
      id_user: fedModel.id_user,
      id_food: fedModel.id_food,
      id_park: fedModel.id_park,
      state: 'SCHEDULED'
    })
  }

  return fedsBulkModel
}

module.exports = router
