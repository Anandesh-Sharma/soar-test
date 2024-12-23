module.exports = {
    createUser: [
        { path: 'username', model: 'username', required: true },
        { path: 'email', model: 'email', required: true },
        { path: 'password', model: 'password', required: true },
        { path: 'role', model: 'role', required: true },
        { path: 'schoolId', model: 'id', required: false }
    ],
    getUser: [
        { path: 'userId', model: 'id', required: true }
    ]
}