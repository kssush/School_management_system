const ApiError = require("../error/ApiError");

class Controller {
    constructor() {
        this.initializeAsyncMethods();
    }

    static AsyncCatch(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next); //?
        };
    }

    initializeAsyncMethods() {     
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        
        for (const method of methods) {
            if (typeof this[method] === 'function' && method !== 'constructor') {
                this[method] = Controller.AsyncCatch(this[method]);
            }
        }
    }

    static validateRequired(data, requiredFields) {
        const missing = requiredFields.filter(field => !data[field]);
        console.log('sdfsdf')
        if (missing.length > 0) {
            throw ApiError.badRequest(`Missing required fields: ${missing.join(', ')}`);
        }
    }
}

module.exports = Controller;


