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

    async getCombination(req, res, next){
        const activeClassName = await classes.getCombination();

        return res.json(activeClassName);
    }

    async getClass(req, res, next){
        const { id } = req.params;

        const students = await classes.getClass(id);

        return res.json(students);
    }   

    async getAllStudent(req, res, next){
        const {isClass} = req.query;
        const isClassBool = isClass == 'true';

        const students = await classes.getAllStudent(isClassBool);

        return res.json(students);
    }
}

module.exports = new ClassController();