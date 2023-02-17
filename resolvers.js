const db = require('./db');

const Query = {
    students: () => db.students.list(),
    student: (parent, { id }) => db.students.get(id),
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