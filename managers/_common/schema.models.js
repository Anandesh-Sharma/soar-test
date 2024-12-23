const { custom } = require("joi");

module.exports = {
  id: {
      type: "string",
      regex: '^[a-f\\d]{24}$',
      length: { min: 1, max: 50 },
      label: 'ID'
  },
  name: {
      type: 'string',
      length: { min: 3, max: 50 },
      label: 'Name'
  },
  email: {
      type: 'string',
      regex: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
      length: { min: 3, max: 100 },
      label: 'Email'
  },
  phone: {
      type: 'string',
      regex: '^\\+?[1-9]\\d{1,14}$',
      length: { min: 1, max: 20 },
      label: 'Phone'
  },
  address: {
      type: 'string',
      length: { min: 10, max: 100 },
      label: 'Address'
  },
  username: {
      type: 'string',
      length: { min: 3, max: 30 },
      label: 'Username'
  },
  password: {
      type: 'string',
      length: { min: 6, max: 100 },
      label: 'Password'
  },
  role: {
      type: 'string',
      oneOf: ['superadmin', 'school_admin'],
      label: 'Role',
  },
  classroomName: {
      type: 'string',
      length: { min: 1, max: 50 },
      label: 'Classroom Name'
  },
  studentName: {
      type: 'string',
      length: { min: 3, max: 50 },
      label: 'Student Name'
  },
  age: {
      type: 'number',
      label: 'Age'
  },
  intFromString: {
    type: 'string',
    custom: 'intFromString',
    label: 'Valid integer'
  },
  notEmptyUpdate: {
    // type: 'object',
    custom: 'notEmptyUpdate',
    label: 'An Object'
  },
};