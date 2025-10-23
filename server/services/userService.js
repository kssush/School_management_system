const { User, Parent } = require("../models/models");
const tokenService = require("./tokenService");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const Service = require("./service");

class UserService{ 
    async registration(data){
        const {email, login, password} = data;

        const [existingEmail, existingLogin] = await Promise.all([
            User.findOne({ where: { email } }),
            User.findOne({ where: { login } })
        ])

        if(existingEmail) throw ApiError.conflict('The user with this EMAIL already exists');
        if(existingLogin) throw ApiError.conflict('The user with this LOGIN already exists');

        const hashPassword = await bcrypt.hash(password, 3);

        const user = await User.create({...data, password: hashPassword});

        return user;
    }

    async registrationParent(id, data){
        const parent = await Parent.create({...data, id});
        
        if(!parent) throw ApiError.badRequest('adasdasdasd')

        return parent;
    }
}

module.exports = new UserService();
