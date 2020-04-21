const passport = require('passport')
const router = require('express').Router()
var db = require('../../db')
const Sequelize = require('sequelize')
const op = Sequelize.Op

router.post('/login', function (req, res, next) {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(400).send(info)
      }
      req.logIn(user, { session: false }, async (error) => {
        if (error) return next(error)

        return res.status(200).send(user.toAuthJSON())
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

router.get('/session', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  db.user
    .findOne({
      where: {
        loginName: req.user.email
      }
    })
    .then((user) => {
      res.status(200).send(user.toAuthJSON())
    })
    .catch((err) => {
      res.status(400).send({ err })
    })

  // res.json({
  //   message: 'You made it to the secure route',
  //   user: req.user, //.toAuthJSON()
  //   token: req.headers.authorization
  //   // token: req.query
  // })
})

router.post('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.token,
    token: req.query.token
  })
})

router.post('/info', (req, res, next) => {
  res.json({
    message: 'connection'
  })
})

router.post('/register', (req, res) => {
  const {
    body: { user }
  } = req
  db.user
    .create({
      name: user.name,
      lastName: user.lastName,
      mail: user.mail,
      loginName: user.loginName,
      loginPassword: user.loginPassword
    })
    .then(function (user) {
      res.status(200).json({ status: 'User Insert', id: user.id })
    })
    .catch(function (err) {
      if (err.errors[0].message) {
        return res.status(422).json({ error: err.errors[0].message })
      }
      console.log(err)
      res.json(err)
    })
})

module.exports = router
