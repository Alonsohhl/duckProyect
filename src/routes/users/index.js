// const mongoose = require('mongoose');
const passport = require('passport')
const router = require('express').Router()
// const auth = require('../auth')
var db = require('../../db')
const Sequelize = require('sequelize')
const op = Sequelize.Op

// router.post('/login', (req, res, next) => {
//   passport.authenticate('login', (err, user, info) => {
//     if (err) {
//       console.log(err)
//       res.status(400).send(err)
//     }
//     if (info != undefined) {
//       console.log(info)
//       res.status(400).send(info)
//     } else {
//       req.logIn(user, (err) => {
//         db.user
//           .findOne({
//             where: {
//               loginName: user.loginName
//             }
//           })
//           .then((userPassport) => {
//             res.status(200).send({
//               user: userPassport.toAuthJSON()
//             })
//           })
//       })
//     }
//   })(req, res, next)
// })

// /* POST login. */
router.post('/login', function (req, res, next) {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        // const error = new Error('An Error occurred')
        // console.log('x')
        // console.dir(user)
        // return next(error)
        res.status(400).send({
          error: info
        })
      }
      req.logIn(user, { session: false }, async (error) => {
        if (error) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        // const body = { _id: user._id, email: user.email }
        //Sign the JWT token and populate the payload with the user email and id
        // const token = jwt.sign({ user: body }, 'top_secret')
        //Send back the token to the user
        // return res.json({ token })
        res.status(200).send({
          user: user.toAuthJSON()
        })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

router.post(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
)

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
    .then(function () {
      res.status(200).json({ status: 'User Insert' })
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
