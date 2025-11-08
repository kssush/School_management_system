// const ApiError = require("../error/ApiError");
const Controller = require("./controller");
const service = require("../services/userService");
const token = require("../services/tokenService");
const ApiError = require("../error/ApiError");


class UserController extends Controller {
    async registration(req, res, next){
        Controller.validateRequired(req.body, ['email', 'password', 'login']);

        const {role} = req.body;
    
        const userData = await service.registration(req.body);
        const familyData = (role == 'dad' || role == 'mam' ?
            await service.registrationParent(userData.id, req.body) : role == 'student' ?
            await service.registrationStudent(userData.id) : 
            {}
        )
        
        return res.json(userData);
    }

    async login(req, res, next){
        Controller.validateRequired(req.body, ['login', 'password']);

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

    async updateTeacher(req, res, next){
        const { id } = req.params;   

        const updatedData = await service.updateTeacher(id, req.body);

        return res.json(updatedData);
    }

    async delete(req, res, next){ 
        //удалить ребенка
    }

    async logout(req, res, next){ 
        token.removeToken(res);

        return res.json();
    }

    async refresh(req, res, next){ 
        // обновить токены
    }

    async getAllTeacher(req, res, next){
        const teachers = await service.getAllTeacher();

        return res.json(teachers);
    }

    async getTeacher(req, res, next){
        const {id} = req.params;

        const teacher = await service.getTeacher(id);

        return res.json(teacher);
    }

    async getFamily(req, res, next){
        const { id } = req.params;
        const { role } = req.query;

        const family = await service.getFamily(id, role);

        return res.json(family);
    }
}

module.exports = new UserController();