const db = require('./db');

const Query = {
    test: () => 'Test Success, GraphQL server is up & running !!',
    students: () => db.students.list(),
    student: (parent, { id }) => db.students.get(id),
    colleges: () => db.colleges.list(),
 }
 module.exports = {Query}