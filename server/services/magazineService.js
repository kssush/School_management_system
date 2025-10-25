const { Composition, Class, Combination, Student, User, Schedule, ScheduleData, Magazine, Grade} = require("../models/models");
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const {Sequelize} = require("../db");
const queries = require("../queries");

class MagazineService {
    async addDay(data){
        const {id_class, id_project, lesson, homework} = data;

        const date = this.getToday();
        const minMax = await this.getIntervarTime(date.weekday);

        const [shedules, existingDay] = await Promise.all([
            Schedule.findAll({
                where: { id_sd: { [Sequelize.Op.between]: [minMax.minId, minMax.maxId] }}
            }),
            Magazine.findAll({where: {id_class, id_project, date: date.date}})
        ])

        console.log(shedules.length , existingDay.length)

        if(shedules.length == existingDay.length) throw ApiError.conflict(
            'All lessons for this subject on this day are already in the journal'
        )
        
        if(!lesson) throw ApiError.unprocessableEntity('The lesson content is required. You can change this later!')
        if(!homework) throw ApiError.unprocessableEntity('The homework content is required. You can change this later!')

        const day = await Magazine.create({...data, date: date.date});

        return day;
    }

    async updateDay(id, data){
        const {lesson, homework} = data;

        if(!lesson && !homework) throw ApiError.unprocessableEntity(
            'The lesson or homework content is required. You can change this later!'
        )

        await Magazine.update(data, {where: {id}})

        const day = await Magazine.findByPk(id);

        return day;
    }

    async addPerformance(data){
        const {pass, mark, remark} = data;

        if(!pass && !mark && !remark) throw ApiError.unprocessableEntity(
            'The pass or mark or remark content is required. You can change this later!'
        )

        const performance = await Grade.create(data);
        
        return performance;
    }

    async updatePerformance(id, data){
        const {pass, mark, remark} = data;

        const tempData = {}
        console.log(pass, mark, remark)
        if(!pass && !mark && !remark) throw ApiError.unprocessableEntity(
            'The pass or mark or remark content is required. You can change this later!'
        )

        if(pass) {
            tempData.pass = true;
            tempData.mark = null,
            tempData.remark = null
        }else{
            tempData.pass = false;
            if(mark) tempData.mark = mark;
            if(remark) tempData.remark = remark;
        }

        await Grade.update(tempData, {where: {id}})

        const day = await Grade.findByPk(id);

        return day;
    }

    async getMagazine(data){ 
        const {id_class, id_project, date} = data;

        const interval = this.getIntervalWeek(date);

        const magazine = await Magazine.findAll({where: {
            id_class, id_project,
            date: {
                [Sequelize.Op.between]: [interval.start, interval.end]
            }
        },
            order: [['date', 'ASC']]
        })

        return magazine; 
    }

    async getPerformance(data){
        const {id_class, id_project, date, id_student} = data;

        const interval = this.getIntervalWeek(date);

        const magazineRecords = await Magazine.findAll({
            where: {
                id_class, 
                id_project,
                date: {
                    [Sequelize.Op.between]: [interval.start, interval.end]
                }
            },
            attributes: ['id'],
            order: [['date', 'ASC']],
            raw: true
        });

        const magazineIds = magazineRecords.map(item => item.id);

        if (magazineIds.length === 0) {
            return [];
        }

        const performance = await Grade.findAll({
            where: {
                id_magazine: {
                    [Sequelize.Op.in]: magazineIds
                },
                ...(id_student && { id_student })
            }
        });

        return performance;
    }

    async addReview(id_student){
        await Composition.update({reviewed: true}, {where: {id_student}})

        return true;
    }

    async removeReview(id_class){
        await Composition.update({reviewed: false}, {where: {id_class}})

        return true;
    }


    // help
    getToday(){
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // +1 т.к. месяцы 0-11
        const day = String(today.getDate()).padStart(2, '0'); // getDate() для числа месяца

        const date = `${year}-${month}-${day}`;

        const weekday = today.getDay();
        const weekdayName = weekdays[today.getDay()];

        return {weekday: weekdayName, date}
    }    

    async getIntervarTime(weekday){
        const id_sd_arr = await ScheduleData.findAll({where: {weekday}})
        const idSdValues = id_sd_arr.map(item => item.id);

        const minId = Math.min(...idSdValues);
        const maxId = Math.max(...idSdValues);

        return {minId, maxId}
    }

    getIntervalWeek(dateStr){
        const date = new Date(dateStr);

        const start = new Date(date);
        start.setDate(date.getDate() - 7);

        const end = new Date(date);
        end.setDate(date.getDate() + 7);
        
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    }
}

module.exports = new MagazineService();
