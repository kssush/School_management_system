// const ApiError = require("../error/ApiError");
const Controller = require("./controller");
const service = require("../services/userService");
const token = require("../services/tokenService");
const ApiError = require("../error/ApiError");


class UserController extends Controller {
    async registration(req, res, next){
        const {role} = req.body;
    
        const userData = await service.registration(req.body);
        const familyData = (role == 'dad' || role == 'mam' ?
            await service.registrationParent(userData.id, req.body) : role == 'student' ?
            await service.registrationStudent(userData.id) : 
            {}
        )
        
        return res.json();
    }

    async login(req, res, next){
        const {login, password} = req.body;

        if(!login || !password) return next(ApiError.badRequest(
            `Uncorrected data! The LOGIN or PASSWORD must not be empty`
        ))

        const data = await service.login(req.body);

        token.saveToken(tokens.refreshToken);

        return res.json(data);
    }

    async update(req, res, next){
        const { id } = req.params;   
        
        const updatedData = await service.update(id, req.body);

        return res.json(updatedData);
    }

    async updateParent(req, res, next){
        const { id } = req.params;   

        const updatedData = await service.updateParent(id, req.body);

        return res.json(updatedData);
    }

    async delete(req, res, next){ 
        //удалить ребенка
    }
    
    async getOne(req, res, next){ 
        //получтиь личную инфрмацию для профиля - учитывать учитель родитель ребенок
    }

    async logout(req, res, next){ 
        token.removeToken(res);

        return res.json();
    }

    async refresh(req, res, next){ 
        // обновить токены
    }
}

module.exports = new UserController();