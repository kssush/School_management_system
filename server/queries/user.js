module.exports = {
    getAllTeacher: `
        SELECT
            u.*,
            cb.letter,
            cb.number
        FROM users u
        LEFT JOIN classes cl ON cl.id_teacher = u.id
        LEFT JOIN combinations cb ON cb.id = cl.id_combination
        WHERE u.role = 'teacher'
    `
}