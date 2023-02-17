const db = require('./db');

const Query = {
    students: () => {
        const students = db.students.list();
        return students.map((student) => {
            student.college = db.colleges.get(student.collegeId);
            return student;
        });
    },
    student: (parent, { id }) => {
        const student = db.students.get(id);
        student.college = db.colleges.get(student.collegeId);
        return student;
    },
    colleges: () => db.colleges.list(),
    college: (parent, { id }) => db.colleges.get(id),
    collegeBy: (parent, { search }) => {

        const name = search.name;
        const location = search.location;
        const rating = search.rating;

        if (name !== undefined && location !== undefined && rating !== undefined) {
            return db.colleges.list().filter(clg => clg.name === name && clg.location === location && clg.rating === rating);
        }
        else if (name !== undefined && location === undefined && rating === undefined) {
            return db.colleges.list().filter(clg => clg.name === name);
        }
        else if (name === undefined && location !== undefined && rating === undefined) {
            return db.colleges.list().filter(clg => clg.location === location);
        }
        else if (name === undefined && location === undefined && rating !== undefined) {
            return db.colleges.list().filter(clg => clg.rating === rating);
        }
        else if (name !== undefined && location !== undefined && rating === undefined) {
            return db.colleges.list().filter(clg => clg.name === name && clg.location === location);
        }
        else if (name !== undefined && location === undefined && rating !== undefined) {
            return db.colleges.list().filter(clg => clg.name === name && clg.rating === rating);
        }
        else if (name === undefined && location !== undefined && rating !== undefined) {
            return db.colleges.list().filter(clg => clg.location === location && clg.rating === rating);
        }
        else {
            return [];
        }
    },
 }
 module.exports = {Query}