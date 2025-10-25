module.exports = {
    getSchedule: `
        SELECT 
            sd.*,
            TO_CHAR(t.time_start, 'HH24:MI') as time_start,
            TO_CHAR(t.time_end, 'HH24:MI') as time_end
        FROM schedule_data sd
        INNER JOIN times t ON sd.id_time = t.id
    `
}