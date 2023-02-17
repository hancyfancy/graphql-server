const db = require('./db');

const Query = {
    students: () => db.students.list(),
    student: (parent, { id }) => db.students.get(id),
    colleges: () => db.colleges.list(),
 }
 module.exports = {Query}