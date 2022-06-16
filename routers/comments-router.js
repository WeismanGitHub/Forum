const { Router } = require('express')
const {
    createComment,
    commentCreationPage,
    getComment,
    commentEditingPage,
    editComment,
    deleteComment,
} = require('../controllers/comments-controller')

const router = Router()

router.route('/edit/:commentId').get(commentEditingPage).post(editComment)
router.route('/delete/:commentId').post(deleteComment)
router.route('/create/:postId').get(commentCreationPage).post(createComment)
router.route('/:commentId').get(getComment)

module.exports = router