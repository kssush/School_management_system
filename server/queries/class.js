module.exports = {
    getClassCompositions: `
        SELECT 
            comp.reviewed,
            s.id,
            s.id_family,
            u.name,
            u.surname,
            u.patronymic,
            u.telephone,
            u.address, 
            u.role, 
            u.birthday, 
            u.image,
            u.login,
            u.email
        FROM compositions comp
        INNER JOIN students s ON comp.id_student = s.id
        INNER JOIN users u ON s.id = u.id
        WHERE comp.id_class = $1
        ORDER BY u.surname ASC, u.name ASC
    `,

    getClassAnalytics: `
        SELECT 
            p.id AS project_id,
            p.name AS project_name,
            json_agg(
                json_build_object(
                    'id', s.id,
                    'name', u.name,
                    'surname', u.surname,
                    'patronymic', u.patronymic,
                    'average_mark', COALESCE(student_stats.avg_mark, 0),
                    'total_passes', COALESCE(student_stats.passes_count, 0),
                    'graded_count', COALESCE(student_stats.grades_count, 0),
                    'prob', CASE 
                        WHEN COALESCE(student_stats.passes_count, 0) > 7 THEN 'middle'
                        WHEN COALESCE(student_stats.grades_count, 0) <= student_stats.passes_count THEN 'middle'
                        WHEN COALESCE(student_stats.avg_mark, 0) <= 5 THEN 'bad'
                        ELSE 'good'
                    END
                )
            ) AS students
        FROM students s
        INNER JOIN users u ON s.id = u.id
        INNER JOIN compositions comp ON s.id = comp.id_student
        INNER JOIN projects p ON p.id IN (
            -- Берем только предметы из расписания этого класса
            SELECT DISTINCT sch.id_project 
            FROM schedules sch 
            INNER JOIN classes c ON sch.id_combination = c.id_combination 
            WHERE c.id = $1
        )
        LEFT JOIN (
            SELECT 
                g.id_student,
                m.id_project,
                AVG(g.mark) AS avg_mark,
                COUNT(CASE WHEN g.pass = true THEN 1 END) AS passes_count,
                COUNT(CASE WHEN g.mark IS NOT NULL THEN 1 END) AS grades_count
            FROM grades g
            INNER JOIN magazines m ON g.id_magazine = m.id
            WHERE m.id_class = $1
                AND m.date >= '2025-09-01'
            GROUP BY g.id_student, m.id_project
        ) student_stats ON student_stats.id_student = s.id AND student_stats.id_project = p.id
        WHERE comp.id_class = $1
        GROUP BY p.id, p.name
        ORDER BY p.name
    `,
    // WHEN COALESCE(student_stats.grades_count, 0) <= 5 THEN 'bad'

    getAllStudent: `
        SELECT u.*, s.id_family 
            FROM users u 
            INNER JOIN students s ON u.id = s.id
            LEFT JOIN compositions c ON u.id = c.id_student 
            WHERE u.role = 'student' 
            AND c.id_student IS NULL
    `,

    getAnyStudent: `
        SELECT u.*, s.id_family, cb.letter, cb.number
            FROM users u 
            INNER JOIN students s ON u.id = s.id
            LEFT JOIN compositions c ON u.id = c.id_student 
            LEFT JOIN classes cl ON cl.id = c.id_class 
            LEFT JOIN combinations cb ON cb.id = cl.id_combination 
            WHERE u.role = 'student' 
    `
};

// getAllStudent: `
//          SELECT u.*, s.id_family 
//             FROM users u 
//             INNER JOIN students s ON u.id = s.id
//             LEFT JOIN compositions c ON u.id = c.id_student 
//             WHERE u.role = 'student' 
//             AND c.id_student IS NULL
//     `