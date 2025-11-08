const { User, Parent, Student, Class, Combination, Composition } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const token = require("./tokenService");
const { Sequelize } = require("../db");
const queries = require("../queries");
const sequelize = require("../db");

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

        const student = await Student.update(
            { 
                id_family: Sequelize.fn(
                    'CONCAT', 
                    Sequelize.col('id_family'), 
                    `${data.role == 'mam' ? 'm' : 'd'}${id}`
                )
            }, 
            { where: { id: data.id_student } }
        );
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
        // if(affectedCount == 0) throw ApiError.notFound('No user with this ID was found!');

        const updatedData = await Parent.findByPk(id);

        return updatedData;
    }

    async updateTeacher(id, data){
        if(data) await User.update(data, {where: {id}}); 

        if (data?.id_class) {
            await Promise.all([
                Class.update( { id_teacher: null }, { where: { id_teacher: id } }),
                Class.update( { id_teacher: id },{ where: { id: data.id_class } })
            ]);
        }

        const [user, classes] = await Promise.all([
            User.findByPk(id),
            Class.findByPk(data?.id_class)
        ])

        const updatedData = await Parent.findByPk(id);

        return updatedData;
    }

    async getAllTeacher(){
        const teachers = await sequelize.query(
            queries.user.getAllTeacher,
            {
                type: sequelize.QueryTypes.SELECT,
                nest: true
            }
        )

        return teachers;
    }

    async getTeacher(id){
        const teacher = await User.findByPk(id);
        const classes = await Class.findOne({where: {id_teacher: id}});
        
        let combination = null;
        if(classes){
            combination = await Combination.findOne({where: {id: classes.id_combination}});
            combination = combination.get({ plain: true });
        }
        
        return {
            ...teacher.get({ plain: true }), //  Sequelize instance в объект
            class: combination ?  `${combination.number} "${combination.letter}"` : null
        };
    }

    async getFamily(id, role){
        let student = null;
        let mam = null;
        let dad = null;

        if(role == 'student') student = await Student.findByPk(id, {include: [{model: User, as: 'user'}, {model: Composition, as: 'student_composition'}]});
        else {
            const letter = role == 'mam' ? 'm' : 'd';
            student = await Student.findOne({
                where: {id_family: { [Sequelize.Op.like]: `%${letter}${id}%` }},
                include: [{ model: User, as: 'user' }, { model: Composition, as: 'student_composition' }]
            });
        }

        const familyId = this.parseParentIds(student.id_family);

        if(familyId.id_mam) mam = await Parent.findByPk(familyId.id_mam, {include: [{model: User, as: 'user'}]})
        if(familyId.id_dad) dad = await Parent.findByPk(familyId.id_dad, {include: [{model: User, as: 'user'}]})
        
        student = student.get({ plain: true });
        mam = mam?.get({ plain: true });
        dad = dad?.get({ plain: true });

        return {mam: {...mam, ...mam?.user, user: undefined}, dad: {...dad, ...dad?.user, user: undefined}, student: {...student, ...student.user, user: undefined}}
    }   


    
    parseParentIds(parentString) {
        if (!parentString || parentString === 'null')  return {};

        let motherId = null;
        let fatherId = null;

        const motherMatch = parentString.match(/m(\d+)/);
        const fatherMatch = parentString.match(/d(\d+)/);

        if (motherMatch) {
            motherId = parseInt(motherMatch[1]);
        }
        if (fatherMatch) {
            fatherId = parseInt(fatherMatch[1]);
        }

        return { id_mam: motherId, id_dad: fatherId };
    }
}

module.exports = new UserService();
