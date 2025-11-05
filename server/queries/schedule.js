module.exports = {
    getLesson: `    
        SELECT
            s.*,
            u.name,
            u.surname,
            u.patronymic,
            p.name as project,
            TO_CHAR(t.time_start, 'HH24:MI') as time_start,
            TO_CHAR(t.time_end, 'HH24:MI') as time_end
        FROM schedules s
        LEFT JOIN users u ON u.id = s.id_teacher
        INNER JOIN projects p ON p.id = s.id_project
        INNER JOIN schedule_data sd ON sd.id = s.id_sd
        LEFT JOIN times t ON t.id = sd.id_time
        WHERE s.id_combination = $1
        AND ($2::text IS NULL OR sd.weekday = $2)
    `,

    getLessonTeacher: `
        SELECT
            s.*,
            c.number,
            c.letter,
            p.name as project
        FROM schedules s
        INNER JOIN combinations c ON s.id_combination = c.id
        INNER JOIN projects p ON p.id = s.id_project
        WHERE s.id_teacher = $1
    `,

    getSchedule: `
        SELECT 
            sd.*,
            TO_CHAR(t.time_start, 'HH24:MI') as time_start,
            TO_CHAR(t.time_end, 'HH24:MI') as time_end
        FROM schedule_data sd
        INNER JOIN times t ON sd.id_time = t.id
        WHERE 
            ($1 = 1 AND sd.id_time BETWEEN 1 AND 6)
            OR ($1 = 2 AND sd.id_time BETWEEN 7 AND 12)
        ORDER BY 
            sd.weekday, 
            sd.id_time
    `
}