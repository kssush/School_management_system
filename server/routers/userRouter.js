const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.patch('/:id', userController.update)
router.patch('/parent/:id', userController.updateParent)
router.patch('/updateTeacher/:id', userController.updateTeacher)
router.get('/teacher', userController.getAllTeacher)
router.get('/teacher/:id', userController.getTeacher)
router.get('/family/:id', userController.getFamily)

module.exports = router 