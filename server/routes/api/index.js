const router = require('express').Router()

const userRoutes = require('./user-routes')
const sessionRoutes = require('./session-routes')

router.use('/user', userRoutes)
router.use('/session', sessionRoutes)

module.exports  = router;