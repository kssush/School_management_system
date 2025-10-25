const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const classRouter = require('./classRouter')
const scheduleRouter = require('./scheduleRouter')

router.use('/user', userRouter)
router.use('/class', classRouter)
router.use('/schedule', scheduleRouter)

module.exports = router  