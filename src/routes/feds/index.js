const router = require('express').Router()
var db = require('../../db')
const Sequelize = require('sequelize')

const op = Sequelize.Op

router.get('/fetchAll', (req, res, next) => {
  let where = {
    [op.and]: {}
  }
  if (req.query.id) where[op.and].id = req.query.id
  // if (req.query.Num_Boleta) where[op.and].Num_Boleta = req.query.Num_Boleta

  db.dataFed
    .findAll({
      include: [
        {
          model: db.user
        }
      ],
      limit: 20,
      order: [['updatedAt', 'DESC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: where
    })
    .then(function (data) {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(404).json({
        error: 'Data not found ' + err,
        dataError: err
      })
    })
})

router.post('/insert', (req, res, next) => {
  const {
    body: { data: dataFed }
  } = req

  db.sequelize.transaction(async (t) => {
    try {
      fed = await db.dataFed.create(dataFed, t)
      // fed = await db.dataFed.create(dataFed, t) SCHEDULE

      return res.status(200).json({ status: 'Fed Inserted', id: fed.id })
    } catch (err) {
      if (!err.errors) return res.status(400).json(err)
      return res.status(400).json(err.errors)
    }
  })
})

router.get('/fetch', (req, res, next) => {
  let where = {
    [op.and]: {}
  }
  if (req.query.id) where[op.and].id = req.query.id
  // if (req.query.Num_Boleta) where[op.and].Num_Boleta = req.query.Num_Boleta

  db.dataFed
    .findAll({
      include: [
        {
          model: db.user
        },
        {
          model: db.food
        }
      ],
      limit: 20,
      order: [['updatedAt', 'DESC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: where
    })
    .then(function (data) {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(404).json({
        error: 'Entries not found ' + err,
        dataError: err
      })
    })
})

module.exports = router
