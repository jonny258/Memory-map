const router = require('express').Router()

const { getSessionData, deleteSession } = require('../../controllers/sessionController')

router.route('/').get(getSessionData).delete(deleteSession)


module.exports  = router;