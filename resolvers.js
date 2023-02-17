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
    studentsBy: (parent, { search }) => {

        const email = search.email;
        const firstName = search.firstName;
        const lastName = search.lastName;

        let students = [];

        if (email !== undefined && firstName !== undefined && lastName !== undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.firstName === firstName && clg.lastName === lastName);
        }
        else if (email !== undefined && firstName === undefined && lastName === undefined) {
            students = db.students.list().filter(clg => clg.email === email);
        }
        else if (email === undefined && firstName !== undefined && lastName === undefined) {
            students = db.students.list().filter(clg => clg.firstName === firstName);
        }
        else if (email === undefined && firstName === undefined && lastName !== undefined) {
            students = db.students.list().filter(clg => clg.lastName === lastName);
        }
        else if (email !== undefined && firstName !== undefined && lastName === undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.firstName === firstName);
        }
        else if (email !== undefined && firstName === undefined && lastName !== undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.lastName === lastName);
        }
        else if (email === undefined && firstName !== undefined && lastName !== undefined) {
            students = db.students.list().filter(clg => clg.firstName === firstName && clg.lastName === lastName);
        }
        else {
            return [];
        }

        return students.map((student) => {
            student.college = db.colleges.get(student.collegeId);
            return student;
        });
    },
    colleges: () => {
        const colleges = db.colleges.list();
        return colleges.map((college) => {
            college.books = college.bookIds.map((bookId) => {
                return db.books.get(bookId);
            });
            return college;
        });
    },
    college: (parent, { id }) => db.colleges.get(id),
    collegesBy: (parent, { search }) => {

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
    books: () => db.books.list(),
    book: (parent, { id }) => db.books.get(id),
    booksBy: (parent, { search }) => {

        const name = search.name;
        const author = search.author;

        if (name !== undefined && author !== undefined) {
            return db.books.list().filter(clg => clg.name === name && clg.author === author);
        }
        else if (name !== undefined && author === undefined) {
            return db.books.list().filter(clg => clg.name === name);
        }
        else if (name === undefined && author !== undefined) {
            return db.books.list().filter(clg => clg.author === author);
        }
        else {
            return [];
        }
    },
 }
 module.exports = {Query}