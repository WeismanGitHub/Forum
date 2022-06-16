const { Router } = require('express')
const {
    getPost,
    createPost,
    postCreationPage,
    postEditingPage,
    editPost,
    deletePost
} = require('../controllers/posts-controller');

const router = Router()

router.route('/').get(postCreationPage).post(createPost)
router.route('/edit/:postId').get(postEditingPage).post(editPost)
router.route('/delete/:postId').post(deletePost)
router.route('/:postId').get(getPost)

module.exports = router