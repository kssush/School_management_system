const Router = require('express')
const router = new Router()

const classController = require('../controllers/classController')

router.post('/addStudent', classController.addStudent)
router.post('/addClass', classController.addClass)
router.post('/classUp', classController.classUp)
router.get('/getCombination', classController.getCombination)
router.get('/getAllCombinations', classController.getAllCombinations)
router.get('/getClass/:id', classController.getClass)
router.get('/getClassAnalytics/:id', classController.getClassAnalytics);
router.get('/getAllStudent', classController.getAllStudent);


module.exports = router