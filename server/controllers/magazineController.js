const Controller = require("./controller");
const magazine = require("../services/magazineService");

class MagazineController extends Controller{
    async addDay(req, res, next){
        const day = await magazine.addDay(req.body);

        return res.json(day);
    }

    async updateDay(req, res, next){
        const {id} = req.params;

        const day = await magazine.updateDay(id, req.body);

        return res.json(day);
    }

    async addPerformance(req, res, next){
        const performance = await magazine.addPerformance(req.body);

        return res.json(performance);
    }

    async updatePerformance(req, res, next){
        const {id} = req.params;

        const performance = await magazine.updatePerformance(id, req.body);

        return res.json(performance);
    }

    async getMagazine(req, res, next){ 
        const magazines = await magazine.getMagazine(req.body);

        return res.json(magazines);
    }

    async getPerformance(req, res, next){
        const performance = await magazine.getPerformance(req.body);

        return res.json(performance);
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