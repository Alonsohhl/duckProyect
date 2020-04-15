// const mongoose = require('mongoose');
const passport = require('passport')
ExtractJWT = require('passport-jwt').ExtractJwt
JWTstrategy = require('passport-jwt').Strategy
var LocalStrategy = require('passport-local').Strategy
const path = require('path')
var db = require('../db')
const { JWT_SECRET } = require(path.join(__dirname, 'envConfig.js'))
// require('../routes/auth/auth.js')

// passport.use(
//   'login',
//   new LocalStrategy(
//     {
//       usernameField: 'user[loginName]',
//       passwordField: 'user[loginPassword]'
//     },
//     function (loginName, loginPassword, done) {
//       console.log('xsd')
//       db.user
//         .findOne({
//           where: {
//             loginName: loginName
//           }
//         })
//         .then(function (dbUser) {
//           console.log('2')
//           // If there's no user with the given email
//           if (!dbUser) {
//             return done(null, false, {
//               message: 'Usuario Incorrecto'
//             })
//           } else if (!dbUser.validPassword(loginPassword)) {
//             // If there is a user with the given email, but the password the user gives us is incorrect
//             return done(null, false, {
//               message: 'Password Incorrecto'
//             })
//           }
//           // Usuario correcto encontrado
//           return done(null, dbUser)
//         })
//         .catch(done)
//     }
//   )
// )

//Create a passport middleware to handle user registration
passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'user[loginName]',
      passwordField: 'user[loginPassword]'
    },
    async (email, password, done) => {
      try {
        //Save the information provided by the user to the the database
        const user = await UserModel.create({ email, password })
        //Send the user information to the next middleware
        return done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'user[loginName]',
      passwordField: 'user[loginPassword]'
    },
    async (loginName, loginPassword, done) => {
      try {
        const user = await db.user.findOne({
          where: {
            loginName: loginName
          }
        })
        if (!user) {
          //If the user isn't found in the database, return a message
          return done(null, false, { message: 'User not found' })
        }
        const validate = await user.validPassword(loginPassword)
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' })
        }
        //Send the user information to the next middleware
        return done(null, user, { message: 'Logged in Successfully' })
      } catch (err) {
        return done(err)
      }
    }
  )
)

// const opts = {
//   jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
//   secretOrKey: JWT_SECRET
// }

// passport.use(
//   'jwt',
//   new JWTstrategy(opts, (jwt_payload, done) => {
//     try {
//       User.findOne({
//         where: {
//           username: jwt_payload.id
//         }
//       }).then((user) => {
//         if (user) {
//           console.log('user found in db in passport')
//           // note the return removed with passport JWT - add this return for passport local
//           done(null, user)
//         } else {
//           console.log('user not found in db')
//           done(null, false)
//         }
//       })
//     } catch (err) {
//       done(err)
//     }
//   })
// )

passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: JWT_SECRET,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token')
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        console.log(token)
        return done(null, token.email)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.serializeUser(function (user, cb) {
  cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
  cb(null, obj)
})

module.exports = passport
