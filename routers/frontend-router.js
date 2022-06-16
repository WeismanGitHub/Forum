const { home, authenticationPage, user } = require('../controllers/frontend-controller')
const authentication = require('../middleware/authentication-middleware')
const { Router } = require('express')

const router = Router()

router.route('/').get(authentication, home)
router.route('/authentication').get(authenticationPage)
router.route('/account').get(authentication, user)

module.exports = router