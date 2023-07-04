const router = require('express').Router()

const { getSessionData } = require('../../controllers/sessionController')

router.route('/').get(getSessionData)


module.exports  = router;