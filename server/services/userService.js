const { User, Parent, Student } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const token = require("./tokenService");

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

    async registrationStudent(id){
        const student = await Student.create({id});
        
        if(!student) throw ApiError.badRequest('adasdasdasd')

        return student;
    }

    async login(data){
        const {login, password} = data;

        const candidate = await User.findOne({where: {login}});
        if(!candidate) throw ApiError.unauthorized('Invalid LOGIN or PASSWORD!');

        const isCorrectPassword = await bcrypt.compare(password, candidate.password);
        if(!isCorrectPassword) throw ApiError.unauthorized('Invalid LOGIN or PASSWORD!')

        const tokens = token.generateTokens({id: candidate.id, login, role: candidate.role});

        return {tokens, user: {
            id: candidate.id,
            role: candidate.role,
            name: candidate.name,
            surname: candidate.surname
        }};
    }

    async update(id, data){
        const { id: _, ...safeData } = data;

        const [affectedCount] = await User.update(safeData, {where: {id}});
        if(affectedCount == 0) throw ApiError.notFound('No user with this ID was found!');

        const updatedData = await User.findByPk(id);

        return updatedData;
    }

    async updateParent(id, data){
        const { id: _, ...safeData } = data;
        
        const [affectedCount] = await Parent.update(safeData, {where: {id}});
        if(affectedCount == 0) throw ApiError.notFound('No user with this ID was found!');

        const updatedData = await Parent.findByPk(id);

        return updatedData;
    }
}

module.exports = new UserService();
