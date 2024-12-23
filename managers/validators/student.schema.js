module.exports = {
    createStudent: [
        { path: 'name', model: 'name', required: true },
        { path: 'age', model: 'age', required: true },
        { path: 'classroomId', model: 'id', required: true },
    ],
    updateStudent: [
        { path: 'name', model: 'name', required: false },
        { path: 'age', model: 'age', required: false },
        { path: 'schoolId', model: 'id', required: true },
        { path: 'studentId', model: 'id', required: true },
        { path: 'classroomId', model: 'id', required: true },
    ],
    getStudents: [
        { path: 'schoolId', model: 'id', required: true },
        { path: 'offset', model: 'intFromString', required: false },
        { path: 'limit', model: 'intFromString', required: false },
    ],
    getStudent: [
        { path: 'schoolId', model: 'id', required: true },
        { path: 'id', model: 'id', required: true },
    ],
    deleteStudent: [
        { path: 'schoolId', model: 'id', required: true },
        { path: 'id', model: 'id', required: true },
    ]
}

