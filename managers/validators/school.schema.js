module.exports = {
    createSchool: [
      { path: 'name', model: 'name', required: true },
      { path: 'address', model: 'address', required: true },
      { path: 'contactEmail', model: 'email', required: true },
      { path: 'contactPhone', model: 'phone', required: true }
    ],
    updateSchool: [
      { path: 'name', model: 'name', required: false },
      { path: 'address', model: 'address', required: false },
      { path: 'contactEmail', model: 'email', required: false },
      { path: 'contactPhone', model: 'phone', required: false }
    ],
    updateSchoolId: [
      { path: 'id', model: 'id', required: true }
    ],
    getSchools: [
      { path: 'offset', model: 'intFromString', required: false },
      { path: 'limit', model: 'intFromString', required: false },
    ],
    getSchool: [
      { path: 'id', model: 'id', required: true },
    ],
    deleteSchool: [
      { path: 'id', model: 'id', required: true },
    ]
};