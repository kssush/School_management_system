const sequelize = require('../db');
const {DataTypes} = require('sequelize');


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    surname: {type: DataTypes.STRING, allowNull: false},
    patronymic: {type: DataTypes.STRING, allowNull: true},
    telephone: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, allowNull: false},
    birthday: {type: DataTypes.DATEONLY, allowNull: false},
    image: {type: DataTypes.STRING, allowNull: true},
    login: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
},{
    timestamps: false
})

const Parent = sequelize.define('parent', {
    id: {type: DataTypes.INTEGER, primaryKey: true, references: { model: User, key: 'id'}},
    work: {type: DataTypes.STRING, allowNull: false},
    post: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, allowNull: false},
},{
    timestamps: false 
})

const Student = sequelize.define('student', {
    id: {type: DataTypes.INTEGER, primaryKey: true,  references: { model: User, key: 'id'}},
    id_family: {type: DataTypes.STRING, allowNull: true},
},{
    timestamps: false
})

const Combination = sequelize.define('combination', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    letter: {type: DataTypes.STRING, allowNull: false},
    number: {type: DataTypes.INTEGER, allowNull: false},
},{
    timestamps: false
})

const Class = sequelize.define('class', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    id_combination: {type: DataTypes.INTEGER, allowNull: false, references: { model: Combination, key: 'id'}},
    year: {type: DataTypes.INTEGER, allowNull: false},
    id_teacher: {type: DataTypes.INTEGER, allowNull: true}
},{
    timestamps: false
})

const Composition = sequelize.define('composition', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    id_class: {type: DataTypes.INTEGER, allowNull: false, references: { model: Class, key: 'id'}},
    id_student: {type: DataTypes.INTEGER, allowNull: true, references: { model: Student, key: 'id'}},
    reviewed: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
},{
    timestamps: false
})

const Project = sequelize.define('project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
},{
    timestamps: false
})

const Time = sequelize.define('time', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    time_start: {type: DataTypes.TIME, allowNull: false},
    time_end: {type: DataTypes.TIME, allowNull: false},
},{
    timestamps: false
})

const ScheduleData = sequelize.define('schedule_data', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    id_time: {type: DataTypes.INTEGER, allowNull: false, references: { model: Time, key: 'id'}},
    weekday: {type: DataTypes.STRING, allowNull: false},
},{
    timestamps: false
})

const Schedule = sequelize.define('schedule', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    id_sd: {type: DataTypes.INTEGER, allowNull: false, references: { model: ScheduleData, key: 'id'}},
    id_combination: {type: DataTypes.INTEGER, allowNull: false, references: { model: Combination, key: 'id'}},
    id_project: {type: DataTypes.INTEGER, allowNull: false, references: { model: Project, key: 'id'}},
    id_teacher: {type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'id'}},
    classroom: {type: DataTypes.STRING, allowNull: true},
},{
    timestamps: false
})

const Magazine = sequelize.define('magazine', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    id_class: {type: DataTypes.INTEGER, allowNull: false, references: { model: Class, key: 'id'}},
    id_project: {type: DataTypes.INTEGER, allowNull: false, references: { model: Project, key: 'id'}},
    date: {type: DataTypes.DATEONLY, allowNull: false},
    lesson: {type: DataTypes.STRING, allowNull: true},
    homework: {type: DataTypes.STRING, allowNull: true},
},{
    timestamps: false
})

const Grade = sequelize.define('grade', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    id_magazine: {type: DataTypes.INTEGER, allowNull: false, references: { model: Magazine, key: 'id'}},
    id_student: {type: DataTypes.INTEGER, allowNull: false, references: { model: Student, key: 'id'}},
    pass: {type: DataTypes.BOOLEAN, allowNull: true},
    mark: {type: DataTypes.INTEGER, allowNull: true},
    remark: {type: DataTypes.STRING, allowNull: true},
},{
    timestamps: false
})

module.exports = {
    User,
    Parent,
    Student,
    Combination,
    Class,
    Composition,
    Project,
    Time,
    ScheduleData,
    Schedule,
    Magazine,
    Grade
}

User.hasMany(Parent, { foreignKey: 'id', sourceKey: 'id', as: 'parent' });
Parent.belongsTo(User, { foreignKey: 'id', targetKey: 'id', as: 'user' });

User.hasOne(Student, { foreignKey: 'id', sourceKey: 'id', as: 'student' });
Student.belongsTo(User, { foreignKey: 'id', targetKey: 'id', as: 'user' });

Combination.hasMany(Class, { foreignKey: 'id_combination', sourceKey: 'id', as: 'class_combination' });
Class.belongsTo(Combination, { foreignKey: 'id_combination', targetKey: 'id', as: 'combination' });

Class.hasMany(Composition, { foreignKey: 'id_class', sourceKey: 'id', as: 'class_composition' });
Composition.belongsTo(Class, { foreignKey: 'id_class', targetKey: 'id', as: 'class' });

Student.hasMany(Composition, { foreignKey: 'id_student', sourceKey: 'id', as: 'student_composition' });
Composition.belongsTo(Student, { foreignKey: 'id_student', targetKey: 'id', as: 'student' });

Time.hasMany(ScheduleData, { foreignKey: 'id_time', sourceKey: 'id', as: 'time_schedule_data' });
ScheduleData.belongsTo(Time, { foreignKey: 'id_time', targetKey: 'id', as: 'time' });

ScheduleData.hasMany(Schedule, { foreignKey: 'id_sd', sourceKey: 'id', as: 'schedule_sd' });
Schedule.belongsTo(ScheduleData, { foreignKey: 'id_sd', targetKey: 'id', as: 'schedule_data' });

Combination.hasMany(Schedule, { foreignKey: 'id_combination', sourceKey: 'id', as: 'schedule_combination' });
Schedule.belongsTo(Combination, { foreignKey: 'id_combination', targetKey: 'id', as: 'combination' });

Project.hasMany(Schedule, { foreignKey: 'id_project', sourceKey: 'id', as: 'schedule_project' });
Schedule.belongsTo(Project, { foreignKey: 'id_project', targetKey: 'id', as: 'project' });

User.hasMany(Schedule, { foreignKey: 'id_teacher', sourceKey: 'id', as: 'schedule_user' });
Schedule.belongsTo(User, { foreignKey: 'id_teacher', targetKey: 'id', as: 'user' });

Class.hasMany(Magazine, { foreignKey: 'id_class', sourceKey: 'id', as: 'magazine_class' });
Magazine.belongsTo(Class, { foreignKey: 'id_class', targetKey: 'id', as: 'class' });

Project.hasMany(Magazine, { foreignKey: 'id_project', sourceKey: 'id', as: 'magazine_project' });
Magazine.belongsTo(Project, { foreignKey: 'id_project', targetKey: 'id', as: 'project' });

Magazine.hasMany(Grade, { foreignKey: 'id_magazine', sourceKey: 'id', as: 'grade_magazine' });
Grade.belongsTo(Magazine, { foreignKey: 'id_magazine', targetKey: 'id', as: 'magazine' });

Student.hasMany(Grade, { foreignKey: 'id_student', sourceKey: 'id', as: 'grade_student' });
Grade.belongsTo(Student, { foreignKey: 'id_student', targetKey: 'id', as: 'student' });