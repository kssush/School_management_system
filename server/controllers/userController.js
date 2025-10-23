// const ApiError = require("../error/ApiError");
const Controller = require("./controller");
const userService = require("../services/userService");


class UserController extends Controller {

    async registration(req, res, next){

    }

    async login(req, res, next){

    }

    async update(req, res, next){
        // общая информация в таблице User
    }

    async updateParent(req, res, next){
        // общая информация у родителей
    }

    async delete(req, res, next){ 
        //удалить ребенка
    }
    
    async getOne(req, res, next){ 
        //получтиь личную инфрмацию для профиля - учитывать учитель родитель ребенок
    }

    async logout(req, res, next){ 
        //выход из аккаунта
    }

    async refresh(req, res, next){ 
        // обновить токены
    }
}

module.exports = new UserController();