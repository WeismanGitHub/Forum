const { register, login } = require('../controllers/authentication-controller')
const { Router } = require('express')

const router = Router()

router.route('/register').post(register)
router.route('/login').post(login)

module.exports = router