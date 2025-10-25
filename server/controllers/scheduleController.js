const Controller = require("./controller");
const schedule = require("../services/scheduleService");

class ScheduleController extends Controller{
    async addLesson(req, res, next){
        Controller.validateRequired(req.body, ['id_sd', 'id_combination', 'id_project']);

        const lesson = await schedule.addLesson(req.body);

        return res.json(lesson);
    }
    
    async deleteLesson(req, res, next){
        const {id} = req.params;

        await schedule.deleteLesson(id);

        return res.json();
    }

    async updateLesson(req, res, next){
        const {id} = req.params;

        const updateData = await schedule.updateLesson(id, req.body);
        
        return res.json();
    }

    async updateTime(req, res, next){
        const {id} = req.params;

        const updateTime = await schedule.updateLesson(id, req.body);
        
        return res.json();
    }

    async getLesson(req, res, next){
        const {id} = req.params; // id_combination

        const lessons = await schedule.getLesson(id);

        return res.json(lessons);
    }

    async getLessonTeacher(req, res, next){
        const {id} = req.params; // id_teacher

        const lessons = await schedule.getLessonTeacher(id);

        return res.json(lessons);
    }

    async getSchedule(req, res, next){
        const scheduleData = await schedule.getSchedule();

        return res.json(scheduleData);
    }
}

module.exports = new ScheduleController();