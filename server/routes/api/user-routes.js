const router = require('express').Router()

const { getAllUsers, userLogin, userSignUp } = require('../../controllers/userController')

router.route('/').get(getAllUsers)

router.route('/login').post(userLogin)
router.route('/signup').post(userSignUp)


module.exports  = router;