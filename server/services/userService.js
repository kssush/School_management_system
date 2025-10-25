const { User, Parent, Student } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const token = require("./tokenService");
const { Sequelize } = require("../db");

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

    async getAllTeacher(){
        const teachers = await User.findAll({where: {role: 'teacher'}})

        return teachers;
    }

    async getFamily(id, role) {
        if (role === 'student') {
            const student = await Student.findByPk(id, {
                include: [{
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] } 
                }],
                raw: true, 
                nest: true 
            });

            if (!student) return {};

            const { motherId, fatherId } = this.parseParentIds(student.id_family);

            const [mam, dad] = await Promise.all([
                motherId ? Parent.findByPk(motherId, { 
                    include: [{
                        model: User, 
                        as: 'user',
                        attributes: { exclude: ['password'] }
                    }],
                    raw: true,
                    nest: true
                }) : null,
                fatherId ? Parent.findByPk(fatherId, { 
                    include: [{
                        model: User, 
                        as: 'user',
                        attributes: { exclude: ['password'] }
                    }],
                    raw: true,
                    nest: true
                }) : null
            ]);

            return {
                student: {id_family: student.id_family, ...student.user},
                mam: mam ? { ...mam, ...mam.user, user: undefined } : null,
                dad: dad ? { ...dad, ...dad.user, user: undefined } : null
            };

        } else {
            const parent = await Parent.findByPk(id, {
                include: [{
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] }
                }],
                raw: true,
                nest: true
            });

            const parentType = parent.role === 'mam' ? 'm' : 'd';
            const parentMask = `${parentType}${id}`;

            const student = await Student.findOne({
                where: {
                    id_family: {
                        [Sequelize.Op.like]: `%${parentMask}%`
                    }
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] }
                }],
                raw: true,
                nest: true
            });

            if (!student) {
                return { ...parent, ...parent.user };
            }

            const { motherId, fatherId } = this.parseParentIds(student.id_family);

            const secondParentId = parent.role === 'mam' ? fatherId : motherId;
            const secondParent = secondParentId ? await Parent.findByPk(secondParentId, {
                include: [{
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] }
                }],
                raw: true,
                nest: true
            }) : null;

            return {
                student: {id_family: student.id_family, ...student.user},
                mam: parent.role === 'mam' ? { ...parent, ...parent.user, user: undefined } : secondParent ? { ...secondParent, ...secondParent.user, user: undefined  } : null,
                dad: parent.role === 'dad' ? { ...parent, ...parent.user, user: undefined  } : secondParent ? { ...secondParent, ...secondParent.user, user: undefined } : null
            };
        }
    }


    //help
    parseParentIds(parentString) {
        if (!parentString || parentString === 'null') {
            return {};
        }

        let motherId = null;
        let fatherId = null;

        // Ищем m11 d12 форматы
        const motherMatch = parentString.match(/m(\d+)/);
        const fatherMatch = parentString.match(/d(\d+)/);

        if (motherMatch) {
            motherId = parseInt(motherMatch[1]);
        }
        if (fatherMatch) {
            fatherId = parseInt(fatherMatch[1]);
        }

        return { motherId, fatherId };
    }
}

module.exports = new UserService();
