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
    `,

    getAllStudent: `
         SELECT u.*, s.id_family 
            FROM users u 
            INNER JOIN students s ON u.id = s.id
            LEFT JOIN compositions c ON u.id = c.id_student 
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