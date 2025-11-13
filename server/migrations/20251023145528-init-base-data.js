"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        console.log('Заполняется таблица базовыми данными...');

        const [combination] = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE role = 'admin'`
        )

        if(combination.length > 0){
            console.log("Миграция уже была. Обратитесь к администратору!")
            return;
        }

        await queryInterface.bulkInsert('users', [
            {
                id: 1,
                name: 'Stanislav',
                surname: 'Sugak',
                patronymic: 'Nikolaevich',
                telephone: '+375 (33) 613-76-41',
                address: 'st. Gagarina, r. Gomel, RB',
                role: 'admin',
                birthday: '2005-06-21', 
                login: 'admin',
                password: await bcrypt.hash('admin', 3)
            }
        ])

        await queryInterface.bulkInsert('combinations', [
            {
                letter: 'A',
                number: 1
            },
            {
                letter: 'B',
                number: 1
            },
            {
                letter: 'A',
                number: 2
            },
            {
                letter: 'B',
                number: 2
            },
            {
                letter: 'A',
                number: 3
            },
            {
                letter: 'B',
                number: 3
            },
            {
                letter: 'A',
                number: 4
            },
            {
                letter: 'B',
                number: 4
            },
            {
                letter: 'A',
                number: 5
            },
            {
                letter: 'B',
                number: 5
            },
            {
                id: 101,
                letter: 'A',
                number: 101
            },
            {
                id: 102,
                letter: 'B',
                number: 102
            }
        ])

        await queryInterface.bulkInsert('times', [
            {
                time_start: '08:00',
                time_end: '08:45'
            },
            {
                time_start: '09:00',
                time_end: '09:45'
            },
            {
                time_start: '09:55',
                time_end: '10:40'
            },
            {
                time_start: '11:10',
                time_end: '11:55'
            },
            {
                time_start: '12:05',
                time_end: '12:50'
            },
            {
                time_start: '12:55',
                time_end: '13:40'
            },
            {
                time_start: '13:55',
                time_end: '14:40'
            },
            {
                time_start: '14:55',
                time_end: '15:40'
            },
            {
                time_start: '15:50',
                time_end: '16:35'
            },
            {
                time_start: '17:05',
                time_end: '17:50'
            },
            {
                time_start: '17:55',
                time_end: '18:40'
            },
            {
                time_start: '18:50',
                time_end: '19:35'
            },
        ])

        await queryInterface.bulkInsert('projects', [
            { name: 'Physics' },
            { name: 'Russian' },
            { name: 'Mathematics' },
            { name: 'Algebra' },
            { name: 'Art' },
            { name: 'Astronomy' },
            { name: 'Biology' },
            { name: 'English' },
            { name: 'Geography' },
            { name: 'Geometry' },
            { name: 'Informatics' },
            { name: 'Labor' },
            { name: 'Literature' },
            { name: 'Physical' },
            { name: 'Social' }
        ]) 

 
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const timeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const scheduleData = [];

        weekdays.forEach(weekday => {
            timeIds.forEach(id_time => {
                scheduleData.push({
                    id_time: id_time,
                    weekday: weekday
                });
            });
        });

        await queryInterface.bulkInsert('schedule_data', scheduleData);
    },

    async down(queryInterface, Sequelize) {
        console.log("Миграция данных не откатывается. \nЕсли это необходимо обратитесь к администратору!");
    },
};
