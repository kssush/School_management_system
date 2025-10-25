const Router = require('express')
const router = new Router()

const scheduleController = require('../controllers/scheduleController')

router.post('/addLesson', scheduleController.addLesson)
router.delete('/deleteLesson/:id', scheduleController.deleteLesson)
router.patch('/updateLesson/:id', scheduleController.updateLesson)
router.get('/getLesson/:id', scheduleController.getLesson)
router.get('/getSchedule', scheduleController.getSchedule)

module.exports = router 