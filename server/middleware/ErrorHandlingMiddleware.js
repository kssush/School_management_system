const ApiError = require('../error/ApiError')

module.exports = function (err, req, res, next) {
    console.log('tyyttttt', err)
    if(err instanceof ApiError){ 
        console.log('tyyyytt')
        return res.status(err.status).json({message: err.message}) 
    }
    return res.status(500).json({message: "Непредвиденная ошибка"})
}
 