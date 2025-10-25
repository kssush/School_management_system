const { Schedule, ScheduleData, Time } = require("../models/models");
const ApiError = require("../error/ApiError");
const queries = require("../queries");
const sequelize = require("../db");

class ScheduleService {
    async addLesson(data){
        const {id_sd, id_combination} = data; 

        const candidate = await Schedule.findOne({where: {id_sd, id_combination}})
        if(candidate) throw ApiError.conflict('The lesson has already been added at this time!')

        const lesson = await Schedule.create(data);

        return lesson;
    }

    async deleteLesson(id){
        const existingLesson = await this.checkLesson(id);
        if(!existingLesson) throw ApiError.notFound('The lesson was not found!')
        
        await Schedule.destroy({where: {id}});
    }

    async updateLesson(id, data){
        const {id_teacher, id_project, classroom} = data; // Проверяем существование урока!!

        const existingLesson = await this.checkLesson(id);
        if(!existingLesson) throw ApiError.notFound('The lesson was not found!')

        const tempData = {};
        
        if(classroom){
            const isOccupy = await this.checkClassroom(classroom);
            if(isOccupy){
                throw ApiError.conflict('Classroom is already occupied!');
            }

            tempData.classroom = classroom;
        }

        if(id_project){
            tempData.id_project = id_project;
            tempData.id_teacher = null; // смена предмета = необходим другой учитель
        }
        
        if (id_teacher) {
            tempData.id_teacher = id_teacher;
        }

        if (Object.keys(tempData).length === 0) {
            throw ApiError.badRequest('No data to update!');
        }

        await Schedule.update(tempData, {where: {id}});

        const updatedLesson = await Schedule.findByPk(id);

        return updatedLesson;
    }

    async updateTime(id, data){
        await Time.update(data, {where: {id}})

        const time = await Time.findOne({where: {id}})

        return time;
    }

    async getLesson(id_combination){
        const lessons = await sequelize.query(
            queries.schedule.getLesson,
            {
                bind: [id_combination],
                type: sequelize.QueryTypes.SELECT,
                nest: true
            }
        )

        return lessons;
    }

    async getLessonTeacher(id_teacher){
        const lessons = await sequelize.query(
            queries.schedule.getLessonTeacher,
            {
                bind: [id_teacher],
                type: sequelize.QueryTypes.SELECT,
                nest: true
            }
        )

        return lessons;
    }

    async getSchedule(){
        const schedule = await sequelize.query(
            queries.schedule.getSchedule,
            {
                type: sequelize.QueryTypes.SELECT,
                nest: true
            }
        )

        return schedule
    }


    // help
    async checkLesson(id){
        const existing = await Schedule.findOne({where: {id}})

        return existing ? true : false;
    }

    async checkClassroom(classroom){
        const occupy = await Schedule.findOne({where: {classroom}})

        return occupy ? true : false;
    }
}

module.exports = new ScheduleService();
