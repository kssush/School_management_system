const Router = require('express')
const router = new Router()

const classController = require('../controllers/classController')

router.post('/addStudent', classController.addStudent)
router.post('/addClass', classController.addClass)
router.post('/classUp', classController.classUp)

module.exports = router 