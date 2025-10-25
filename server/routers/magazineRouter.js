const Router = require('express')
const router = new Router()

const magazineController = require('../controllers/magazineController')

router.post('/addDay', magazineController.addDay)
router.patch('/updateDay/:id', magazineController.updateDay)
router.post('/addPerformance', magazineController.addPerformance)
router.patch('/updatePerformance/:id', magazineController.updatePerformance)
router.get('/getMagazine', magazineController.getMagazine)
router.get('/getPerformance', magazineController.getPerformance)
router.patch('/addReview/:id_student', magazineController.addReview)
router.patch('/removeReview/:id_class', magazineController.removeReview)

module.exports = router 