const passport = require('passport')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const path = require('path')
const { JWT_SECRET } = require(path.join(
  __dirname,
  '../../config/envConfig.js'
))

//This verifies that the token sent by the user is valid
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
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    }
  )
)
