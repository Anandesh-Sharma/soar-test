module.exports = {
  createClassroom: [
    { path: 'classroomName', model: 'classroomName', required: true },
    { path: 'capacity', type: 'number', required: true, label: 'Capacity' },
    { path: 'resources', type: 'array', items: { type: 'string' }, required: true, label: 'Resources' }
  ],
  createClassroomId: [
    { path: 'id', model: 'id', required: true }
  ],
  updateClassroom: [
    { path: 'classroomName', model: 'classroomName', required: false },
    { path: 'capacity', type: 'number', required: false, label: 'Capacity' },
    { path: 'resources', type: 'array', items: { type: 'string' }, required: false, label: 'Resources' }
  ],
  getClassrooms: [
    { path: 'offset', model: 'intFromString', required: false },
    { path: 'limit', model: 'intFromString', required: false },
  ],
  getClassroom: [
    { path: 'id', model: 'id', required: true },
  ],
  deleteClassroom: [
    { path: 'id', model: 'id', required: true },
  ]
}