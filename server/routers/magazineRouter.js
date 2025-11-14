const Router = require('express')
const router = new Router()

const magazineController = require('../controllers/magazineController')

router.post('/addDay', magazineController.addDay)
router.patch('/updateDay/:id', magazineController.updateDay)
router.post('/addPerformance', magazineController.addPerformance)
router.patch('/updatePerformance/:id', magazineController.updatePerformance)
router.get('/getMagazine', magazineController.getMagazine)
router.get('/getPerformance', magazineController.getPerformance)
router.get('/getScheduleHomework/:id_student', magazineController.getScheduleHomework)
router.get('/getLessonHomework/:id_student', magazineController.getLessonHomework)
router.patch('/addReview/:id_student', magazineController.addReview)
router.patch('/removeReview/:id_class', magazineController.removeReview)
router.patch('/resetReview/:id_class', magazineController.resetReview)
router.get('/getReview/:id_student', magazineController.getReview)

module.exports = router 