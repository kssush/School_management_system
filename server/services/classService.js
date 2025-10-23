const { Composition, Class, Combination } = require("../models/models");
const ApiError = require("../error/ApiError");
const Sequelize = require("../db");

class ClassService {
    async addStudent(data) {
        const { id_student } = data;

        const candidate = await Composition.findOne({ where: { id_student } });

        if (candidate)
            throw ApiError.conflict(
                "The student has already been added to another class!"
            );

        const composition = await Composition.create(data);

        return composition;
    }

    async addClass(data) {
        const { id_combination } = data;

        const currentDate = new Date();

        const month = currentDate.getMonth();
        let year = currentDate.getFullYear();

        if (month < 6) year--;

        const candidate = await Class.findOne({
            where: { id_combination, year },
        });
        if (candidate)
            throw ApiError.conflict("The class has already been added!");

        const classes = await Class.create({ id_combination, year });

        return classes;
    }

    async classUp() {
        const [combinations, classes] = await Promise.all([
            Combination.findAll(),
            Class.findAll(),
        ]);

        const combById = new Map(combinations.map((c) => [c.id, c])); // ключ айди комбинации, значение - номер и буква
        const combMap = new Map();
        combinations.forEach((c) => {
            combMap.set(`${c.letter}_${c.number}`, c);
        });

        const updates = classes
            .map((cls) => {
                const comb = combById.get(cls.id_combination);
                if (!comb) return null;

                const nextComb = combMap.get(
                    `${comb.letter}_${comb.number + 1}`
                );
                return {
                    id: cls.id,
                    id_combination: nextComb ? nextComb.id : cls.id_combination,
                };
            })
            .filter(Boolean);

        const transaction = await Sequelize.transaction();
        
        try {
            for (const update of updates) {
                await Class.update(
                    { id_combination: update.id_combination },
                    {
                        where: { id: update.id },
                        transaction,
                    }
                );
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new ClassService();
