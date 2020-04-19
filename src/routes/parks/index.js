const router = require('express').Router()
var db = require('../../db')
const Sequelize = require('sequelize')

const op = Sequelize.Op

router.get('/fetch', (req, res, next) => {
  let where = {
    [op.and]: {}
  }
  if (req.query.id) where[op.and].id = req.query.id
  if (req.query.name) where[op.and].name = req.query.name

  db.park
    .findAll({
      order: [['updatedAt', 'DESC']],
      attributes: { exclude: ['createdAt', 'updatedAt', 'state'] },
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
    body: { data: dataPark }
  } = req

  db.sequelize.transaction(async (t) => {
    try {
      park = await db.park.create(dataPark, t)

      return res.status(200).json({ status: 'Park Inserted', id: park.id })
    } catch (err) {
      if (!err.errors) return res.status(400).json(err)
      return res.status(400).json(err.errors)
    }
  })
})

router.post('/delete', (req, res, next) => {
  const {
    body: { park }
  } = req

  db.park
    .update(
      { state: 'DELETE' },
      {
        where: {
          id: park.id
        }
      }
    )
    .then((x) => {
      if (x < 1) {
        return res.status(400).send({ error: 'entry Error' })
      }
      res.status(200).json({ status: 'Entry Delete' })
    })
    .catch((err) => {
      res.status(400).send({ error: err })
    })
})

module.exports = router
