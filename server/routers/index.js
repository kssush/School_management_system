const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const classRouter = require('./classRouter')

router.use('/user', userRouter)
router.use('/class', classRouter)

module.exports = router  