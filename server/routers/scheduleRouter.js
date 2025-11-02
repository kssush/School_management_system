const Router = require('express')
const router = new Router()

const scheduleController = require('../controllers/scheduleController')

router.post('/addLesson', scheduleController.addLesson)
router.delete('/deleteLesson/:id', scheduleController.deleteLesson)
router.patch('/updateLesson/:id', scheduleController.updateLesson)
router.patch('/updateTime/:id', scheduleController.updateTime)
router.get('/getLesson/:id', scheduleController.getLesson)
router.get('/getLessonTeacher/:id', scheduleController.getLessonTeacher)
router.get('/getSchedule', scheduleController.getSchedule)
router.get('/getShift/:id', scheduleController.getShift)

module.exports = router;