const express = require('express')
const router = express.Router()
const passport = require('passport')

router.use('/users', require('./users'))
router.use('/feds', passport.authenticate('jwt', { session: false }), require('./feds'))
router.use('/parks', passport.authenticate('jwt', { session: false }), require('./parks'))
router.use('/kinds', passport.authenticate('jwt', { session: false }), require('./kinds'))
router.use('/foods', passport.authenticate('jwt', { session: false }), require('./foods'))
router.use('/schedules', passport.authenticate('jwt', { session: false }), require('./schedules'))

module.exports = router
