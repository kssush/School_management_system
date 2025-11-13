const { Composition, Class, Combination, Student, User, Schedule, ScheduleData, Magazine, Grade, Project} = require("../models/models");
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const {Sequelize} = require("../db");
const queries = require("../queries");

const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

        if(shedules.length == 0) throw ApiError.conflict(
            'There is no subject for this class today'
        )

        if(shedules.length == existingDay.length) throw ApiError.conflict(
            'All lessons for this subject on this day are already in the journal'
        )
        
        if(!lesson) throw ApiError.unprocessableEntity('The lesson content is required. You can change this later!')
        // if(!homework) throw ApiError.unprocessableEntity('The homework content is required. You can change this later!')

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
     
        if(pass === undefined && mark === undefined && remark === undefined) throw ApiError.unprocessableEntity(
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
  
        if(remark === null) tempData.remark = null;
        if(mark == 0) tempData.mark = null;

        await Grade.update(tempData, {where: {id}})

        const day = await Grade.findByPk(id);

        return day;
    }

    async getMagazine(data){ 
        const {id_class, id_project, date} = data;

        const interval = this.getIntervalMonth(date);

        const magazine = await Magazine.findAll({where: {
            id_class, id_project,
            date: {
                [Sequelize.Op.between]: [interval.start, interval.end]
            }
        },
            order: [['date', 'ASC']]
        })

        // return magazine; 
        
        const daysWithLessons = {};
    
        magazine.forEach(lesson => {
            const day = lesson.date.toString();
            
            if (!daysWithLessons[day]) {
                const [year, month, dayNum] = lesson.date.split('-');

                daysWithLessons[day] = {
                    date: lesson.date,
                    formatDate: `${dayNum}.${month}`,
                    lessons: []
                };
            }
            
            daysWithLessons[day].lessons.push(lesson);
        });

        return Object.values(daysWithLessons);
    }

    async getPerformance(data){
        const {id_class, id_project, date, id_student} = data;
        
        const interval = this.getIntervalMonth(date);

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

        const grade = await Grade.findAll({
            where: {
                id_magazine: {
                    [Sequelize.Op.in]: magazineIds
                },
                ...(id_student && { id_student }) /// 
            }
        });

        const daysWithLessons = {};
    
        grade.forEach(lesson => {
            const id_magazine = lesson.id_magazine;
            
            if (!daysWithLessons[id_magazine]) {
                daysWithLessons[id_magazine] = []
            }
            
            daysWithLessons[id_magazine].push(lesson);
        });

        return daysWithLessons
    }

    async getScheduleHomework(id_student){
        const classes = await Composition.findOne({where: {id_student}, include: [{model: Class, as: 'class'}]})

        const id_combination = classes.class.id_combination;
        const id_class = classes.class.id;
        
        const schedule = await Schedule.findAll({where: {id_combination}, include: [
            {model: ScheduleData, as: 'schedule_data'},
            {model: Project, as: 'project'}
        ]})
        
        const groupedByDay = schedule.reduce((acc, item) => {
            const day = item.schedule_data.weekday;
            if (!acc[day]) {
                acc[day] = [];
            }
            
            const temp = {...item.get({plain: true}), name: item.project?.name, schedule_data: undefined, project: undefined}

            acc[day].push(temp);
            return acc;
        }, {});

       
        const sortedResult = {};
        daysOrder.forEach(day => {
            sortedResult[day] = groupedByDay[day] ?? [];
        });

        return sortedResult;
    }

    async getLessonHomework(id_student, date){
        const classes = await Composition.findOne({where: {id_student}, include: [{model: Class, as: 'class'}]})

        const id_class = classes.class.id;
    
        const interval = this.getIntervalWeek(date);
     
        const magazine = await Magazine.findAll({
            where: {
                id_class,
                date: {[Sequelize.Op.between]: [interval.start, interval.end]}
            },
            order: [['date', 'ASC']] // сортируем по дате
        });
        
        const magazineIds = magazine.map(mg => mg.id);
     
        const grade = await Grade.findAll({
            where: {
                id_magazine: {
                    [Sequelize.Op.in]: magazineIds
                },
                id_student
            }
        });
     
        const groupedByDate = magazine.reduce((acc, item) => {
            const date = item.date;
           
            if (!acc[date]) {
                acc[date] = [];
            }
            
            acc[date].push(item);
            return acc;
        }, {});
       
        return {magazine: groupedByDate, grade}
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
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');

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

    getIntervalMonth(dateStr){
        const date = new Date(dateStr); 
    
        const start = new Date(date.getFullYear(), date.getMonth(), 1); 
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        return {
            start: start.toLocaleDateString('en-CA'),
            end: end.toLocaleDateString('en-CA')
        };
    }
    
    getIntervalWeek(date){
        const start = new Date(date);

        const end = new Date(date);
        end.setDate(end.getDate() + 6);

        const formatDate = (date) => {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };


        return {start: formatDate(start), end: formatDate(end)}
    }

    
}

module.exports = new MagazineService();
