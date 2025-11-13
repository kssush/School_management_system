const Controller = require("./controller");
const magazine = require("../services/magazineService");

class MagazineController extends Controller{
    async addDay(req, res, next){
        Controller.validateRequired(req.body, ['id_class', 'id_project', 'lesson']);

        const day = await magazine.addDay(req.body);

        return res.json(day);
    }

    async updateDay(req, res, next){
        const {id} = req.params;

        const day = await magazine.updateDay(id, req.body);

        return res.json(day);
    }

    async addPerformance(req, res, next){
        Controller.validateRequired(req.body, ['id_magazine', 'id_student']);

        const performance = await magazine.addPerformance(req.body);

        return res.json(performance);
    }

    async updatePerformance(req, res, next){
        const {id} = req.params;

        const performance = await magazine.updatePerformance(id, req.body);

        return res.json(performance);
    }

    async getMagazine(req, res, next){ 
        Controller.validateRequired(req.query, ['id_class', 'id_project', 'date']);

        const magazines = await magazine.getMagazine(req.query);

        return res.json(magazines);
    }

    async getPerformance(req, res, next){
        Controller.validateRequired(req.query, ['id_class', 'id_project', 'date']); //'id_student'
        
        const performance = await magazine.getPerformance(req.query);

        return res.json(performance);
    }

    async getScheduleHomework(req, res, next){
        const {id_student} = req.params;
       
        const schedule = await magazine.getScheduleHomework(id_student);
        
        return res.json(schedule);
    }

    async getLessonHomework(req, res, next){
        const {id_student} = req.params;
        const {date} = req.query;
        
        const schedule = await magazine.getLessonHomework(id_student, date);
        
        return res.json(schedule);
    }

    async addReview(req, res, next){
        const {id_student} = req.params;

        const review = await magazine.addReview(id_student);

        return res.json(review);
    }

    async removeReview(req, res, next){
        const {id_class} = req.params;

        const review = await magazine.removeReview(id_class);

        return res.json(review);
    }
}

module.exports = new MagazineController();