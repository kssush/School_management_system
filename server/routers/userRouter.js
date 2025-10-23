const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')

router.post('/', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.patch('/:id', userController.update)
router.patch('/parent/:id', userController.updateParent)

module.exports = router 