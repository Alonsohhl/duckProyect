var express = require('express')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
const app = express()
const session = require('express-session')
var schedule = require('node-schedule')
const { Op } = require('sequelize')
const moment = require('moment')

// var passport = require('./config/passport')
require('./config/passport')

const BTRoutes = require('./routes')
var db = require('./db')

require('dotenv').config() //  check enviroment variables

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

/* ==== SETTINGS ===== */
app.set('port', process.env.PORT || 3000)

// ==== MIDDLEWARE =====
app.use(require('morgan')('dev')) // Use morgan to log
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/', BTRoutes)

// ======== launch app ========

db.sequelize.sync().then(function () {
  app.listen(app.get('port'), function () {
    console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ ',
      app.get('port'),
      app.get('port')
    )
  })
})

schedule.scheduleJob('*/15 * * * *', async function () {
  const [results, metadata] = await db.sequelize.query(`UPDATE db_ducks.datafeds
  SET state = 'ACTIVE'
  WHERE db_ducks.datafeds.time BETWEEN '${moment()
    .startOf('hour')
    .format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
    .endOf('hour')
    .format('YYYY-MM-DD HH:mm:ss')}';`)

  console.log(metadata)
})

module.exports = app
