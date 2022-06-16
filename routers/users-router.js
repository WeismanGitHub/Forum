const { Router } = require('express')
const { 
    logout,
    deleteUser,
    updateUser,
    getUser,
    getUsersPosts
} = require('../controllers/users-controller')

const router = Router()

router.route('/logout').post(logout)
router.route('/delete').post(deleteUser)
router.route('/:userId/posts').get(getUsersPosts)
router.route('/:userId').get(getUser).post(updateUser)

module.exports = router