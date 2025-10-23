const Controller = require("./controller");
const classes = require("../services/classService");

class ClassController extends Controller{
    async addStudent(req, res, next){
        const data = await classes.addStudent(req.body);

        return res.json(data); // нужна ли информация о добавленном ученике?
    }

    async addClass(req, res, next){
        const data = await classes.addClass(req.body);

        return res.json();
    }

    async classUp(req, res, next){
        await classes.classUp();

        return res.json();
    }
}

module.exports = new ClassController();