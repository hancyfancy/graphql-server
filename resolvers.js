const db = require('./db');
const crypto = require('crypto-js');

const Query = {
    students: () => {
        const students = db.students.list();
        return students.map((student) => {
            student.college = db.colleges.get(student.collegeId);
            student.college.books = student.college.bookIds.map((bookId) => {
                return db.books.get(bookId);
            });
            return student;
        });
    },
    student: (parent, { id }) => {
        const student = db.students.get(id);
        student.college = db.colleges.get(student.collegeId);
        student.college.books = student.college.bookIds.map((bookId) => {
            return db.books.get(bookId);
        });
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
            student.college.books = student.college.bookIds.map((bookId) => {
                return db.books.get(bookId);
            });
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
    college: (parent, { id }) => {
        const college = db.colleges.get(id);
        college.books = college.bookIds.map((bookId) => {
            return db.books.get(bookId);
        });
        return college;
    },
    collegesBy: (parent, { search }) => {

        const name = search.name;
        const location = search.location;
        const rating = search.rating;

        let colleges = [];

        if (name !== undefined && location !== undefined && rating !== undefined) {
            colleges = db.colleges.list().filter(clg => clg.name === name && clg.location === location && clg.rating === rating);
        }
        else if (name !== undefined && location === undefined && rating === undefined) {
            colleges = db.colleges.list().filter(clg => clg.name === name);
        }
        else if (name === undefined && location !== undefined && rating === undefined) {
            colleges = db.colleges.list().filter(clg => clg.location === location);
        }
        else if (name === undefined && location === undefined && rating !== undefined) {
            colleges = db.colleges.list().filter(clg => clg.rating === rating);
        }
        else if (name !== undefined && location !== undefined && rating === undefined) {
            colleges = db.colleges.list().filter(clg => clg.name === name && clg.location === location);
        }
        else if (name !== undefined && location === undefined && rating !== undefined) {
            colleges = db.colleges.list().filter(clg => clg.name === name && clg.rating === rating);
        }
        else if (name === undefined && location !== undefined && rating !== undefined) {
            colleges = db.colleges.list().filter(clg => clg.location === location && clg.rating === rating);
        }
        else {
            return [];
        }

        return colleges.map((college) => {
            college.books = college.bookIds.map((bookId) => {
                return db.books.get(bookId);
            });
            return college;
        });
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

const Mutation = {
    addStudent: (parent, { student }) => {
        const studentSerialised = JSON.stringify(student);
        const encrypted = crypto.MD5(studentSerialised).toString(crypto.enc.Hex);
        const existingStudentRaw = db.students.get(encrypted);
        if (existingStudentRaw !== undefined) {
            const existingStudent = JSON.parse(JSON.stringify(existingStudentRaw));
            existingStudent.college = db.colleges.get(existingStudent.collegeId);
            existingStudent.college.books = existingStudent.college.bookIds.map((bookId) => {
                return db.books.get(bookId);
            });
            return existingStudent;
        }
        else {
            student.id = encrypted;
            db.students.create(student);
            student.college = db.colleges.get(student.collegeId);
            student.college.books = student.college.bookIds.map((bookId) => {
                return db.books.get(bookId);
            });
            return student;
        }
    },
    addStudents: (parent, { students }) => {
        return students.map((student) => {
            const studentSerialised = JSON.stringify(student);
            const encrypted = crypto.MD5(studentSerialised).toString(crypto.enc.Hex);
            const existingStudentRaw = db.students.get(encrypted);
            if (existingStudentRaw !== undefined) {
                const existingStudent = JSON.parse(JSON.stringify(existingStudentRaw));
                existingStudent.college = db.colleges.get(existingStudent.collegeId);
                existingStudent.college.books = existingStudent.college.bookIds.map((bookId) => {
                    return db.books.get(bookId);
                });
                return existingStudent;
            }
            else {
                student.id = encrypted;
                db.students.create(student);
                student.college = db.colleges.get(student.collegeId);
                student.college.books = student.college.bookIds.map((bookId) => {
                    return db.books.get(bookId);
                });
                return student;
            }
        });
    },
    updateStudent: (parent, { id, student }) => {
        const existingStudentRaw = db.students.get(id);
        if (existingStudentRaw !== undefined) {
            const existingStudent = JSON.parse(JSON.stringify(existingStudentRaw));
            db.students.delete(id);
            const studentSerialised = JSON.stringify(student);
            const encrypted = crypto.MD5(studentSerialised).toString(crypto.enc.Hex);
            student.id = encrypted;

            if (student.email === undefined) {
                student.email = existingStudent.email;
            }

            if (student.lastName === undefined) {
                student.lastName = existingStudent.lastName;
            }

            if (student.firstName === undefined) {
                student.firstName = existingStudent.firstName;
            }

            if (student.collegeId === undefined) {
                student.collegeId = existingStudent.collegeId;
            }

            db.students.create(student);
            return student;
        }

        return {};
    },
}

 module.exports = {Query, Mutation}