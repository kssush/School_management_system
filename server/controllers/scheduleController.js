const Controller = require("./controller");
const schedule = require("../services/scheduleService");

class ScheduleController extends Controller{
    async addLesson(req, res, next){
        const lesson = await schedule.addLesson(req.body);

        return res.json(lesson);

        // проверить или не занят кабинет
    }
    
    async deleteLesson(req, res, next){
        const {id} = req.params;

        await schedule.deleteLesson(id);

        return res.json();
    }

    async updateLesson(req, res, next){
        const {id} = req.params;

        const updateData = await schedule.updateLesson(id, req.body);
        
        // если меняется предмет убирается учитель
        // можно сменить учителя
        // класс рум убирается спокойно
        //
        return res.json();
    }

    async getLesson(req, res, next){
        const {id} = req.params; // id_combination

        const lessons = await schedule.getLesson(id);

        return res.json(lessons);
    }

    async getSchedule(req, res, next){
        const scheduleData = await schedule.getSchedule();

        return res.json(scheduleData);
    }
}

module.exports = new ScheduleController();