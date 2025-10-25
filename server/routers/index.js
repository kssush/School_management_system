const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const classRouter = require('./classRouter')
const scheduleRouter = require('./scheduleRouter')
const magazineRouter = require('./magazineRouter')

router.use('/user', userRouter)
router.use('/class', classRouter)
router.use('/schedule', scheduleRouter)
router.use('/magazine', magazineRouter)

module.exports = router  