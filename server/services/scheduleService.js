const { Schedule, ScheduleData, Time, Project } = require("../models/models");
const ApiError = require("../error/ApiError");
const queries = require("../queries");
const sequelize = require("../db");

class ScheduleService {
    async addLesson(data){
        const {id_sd, id_combination, classroom} = data; 

        const candidate = await Schedule.findOne({where: {id_sd, id_combination}})
        if(candidate) throw ApiError.conflict('The lesson has already been added at this time!')
        
        if(classroom){
            const isOccupy = await this.checkClassroom(classroom, id_sd);

            if(isOccupy) throw ApiError.conflict('Classroom is already occupied!');
        }

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
            const isOccupy = await this.checkClassroom(classroom, existingLesson.id_sd);
            if(isOccupy){
                throw ApiError.conflict('Classroom is already occupied!');
            }

            tempData.classroom = classroom;
        }

        if(id_project){
            tempData.id_project = id_project;
            tempData.id_teacher = null; // смена предмета = необходим другой учитель
        }
        
        if (id_teacher !== undefined) {
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
        const {time_start, time_end} = data;

        if(!time_start || !time_end) throw ApiError.badRequest('All the time must be filled in!');

        if(time_start > time_end) {
            const temp = time_start;
            time_start = time_end;
            time_end = temp;
        }

        const allTime = await Time.findAll();

        const currentItems = allTime.filter(el => el.id == Number(id) || el.id == Number(id) + 1 || el.id == Number(id) - 1).sort((a,b) => a.id - b.id)

        if(id == 1){
            if(currentItems[1].time_start < time_end) 
                throw ApiError.conflict('The time should be less then the next values!');
        }else{
            if(id == 12){
                if(currentItems[11].time_end > time_start) 
                    throw ApiError.conflict('The time should be greater then the previos values!');
            }else{
                if(currentItems[0].time_end > time_start || currentItems[2].time_start < time_end )
                    throw ApiError.conflict('The time should be between the previous and next values!');
            }
        }

        await Time.update(data, {where: {id}})

        const time = await Time.findOne({where: {id}})

        return time;
    }

    async getLesson(id_combination, weekday){
        const lessons = await sequelize.query(
            queries.schedule.getLesson,
            {
                bind: [id_combination, weekday ?? null],
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

    async getSchedule(shift){
        const schedule = await sequelize.query(
            queries.schedule.getSchedule,
            {
                bind: [shift],
                type: sequelize.QueryTypes.SELECT,
                nest: true
            }
        )

        return schedule
    }

    async getShift(id_combination){
        const schedule = await Schedule.findOne({where: {id_combination}});

        if(!schedule) return 0;

        const time = await ScheduleData.findOne({where: {id: schedule.id_sd}})

        return time.id_time < 7 ? 1 : 2
    }

    async getSubject(){
        const subjects = await Project.findAll();

        return subjects;
    }

    async getSubjectForClass(id_combination){
        console.log(id_combination,'123')
        const subjects = await Project.findAll({
            include: [{
                model: Schedule, as: 'schedule_project',
                where: {
                    id_combination: id_combination
                },
                attributes: [] 
            }],
            distinct: true 
        });

        return subjects;
    }

    // help
    async checkLesson(id){
        const existing = await Schedule.findOne({where: {id}})

        return existing;
    }

    async checkClassroom(classroom, id_sd){
        const occupy = await Schedule.findOne({where: {classroom, id_sd}})

        return occupy ? true : false;
    }
}

module.exports = new ScheduleService();
