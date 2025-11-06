const classQueries = require('./class');
const scheduleQueries = require('./schedule');
const userQueries = require('./user')

module.exports = {
    class: classQueries,
    schedule: scheduleQueries,
    user: userQueries
};