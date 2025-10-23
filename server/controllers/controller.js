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
}

module.exports = Controller;


