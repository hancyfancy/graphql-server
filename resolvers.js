const db = require('./db');
const crypto = require('crypto-js');

const populateStudentAux = (student) => {
    student.college = db.colleges.get(student.collegeId);
    student.college.books = student.college.bookIds.map((bookId) => {
        return db.books.get(bookId);
    });
    return student;
};

const populateBookAux = (book) => {
    book.colleges = book.collegeIds.map((collegeId) => {
        return db.colleges.get(collegeId);
    });

    book.colleges.map((college) => {
        const students = college.studentIds.map((studentId) => {
            return db.students.get(studentId);
        });

        college.students = students;
    });

    return book;
};

const populateCollegeAux = (college) => {
    college.books = college.bookIds.map((bookId) => {
        return db.books.get(bookId);
    });
    college.students = college.studentIds.map((studentId) => {
        return db.students.get(studentId);
    });
    return college;
};

const Query = {
    students: () => {
        const students = db.students.list();
        return students.map((student) => {
            return populateStudentAux(student);
        });
    },
    student: (parent, { id }) => {
        const student = db.students.get(id);
        return populateStudentAux(student);
    },
    studentsBy: (parent, { search }) => {

        const email = search.email;
        const firstName = search.firstName;
        const lastName = search.lastName;
        const collegeId = search.collegeId;

        let students = [];

        if (email !== undefined && firstName !== undefined && lastName !== undefined && collegeId !== undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.firstName === firstName && clg.lastName === lastName && clg.collegeId === collegeId);
        }
        else if (email !== undefined && firstName === undefined && lastName === undefined && collegeId === undefined) {
            students = db.students.list().filter(clg => clg.email === email);
        }
        else if (email === undefined && firstName !== undefined && lastName === undefined && collegeId === undefined) {
            students = db.students.list().filter(clg => clg.firstName === firstName);
        }
        else if (email === undefined && firstName === undefined && lastName !== undefined && collegeId === undefined) {
            students = db.students.list().filter(clg => clg.lastName === lastName);
        }
        else if (email === undefined && firstName === undefined && lastName === undefined && collegeId !== undefined) {
            students = db.students.list().filter(clg => clg.collegeId === collegeId);
        }
        else if (email !== undefined && firstName !== undefined && lastName === undefined && collegeId === undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.firstName === firstName);
        }
        else if (email !== undefined && firstName === undefined && lastName !== undefined && collegeId === undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.lastName === lastName);
        }
        else if (email !== undefined && firstName === undefined && lastName === undefined && collegeId !== undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.collegeId === collegeId);
        }
        else if (email === undefined && firstName !== undefined && lastName !== undefined && collegeId === undefined) {
            students = db.students.list().filter(clg => clg.firstName === firstName && clg.lastName === lastName);
        }
        else if (email === undefined && firstName !== undefined && lastName === undefined && collegeId !== undefined) {
            students = db.students.list().filter(clg => clg.firstName === firstName && clg.collegeId === collegeId);
        }
        else if (email === undefined && firstName === undefined && lastName !== undefined && collegeId !== undefined) {
            students = db.students.list().filter(clg => clg.lastName === lastName && clg.collegeId === collegeId);
        }
        else if (email !== undefined && firstName !== undefined && lastName !== undefined && collegeId === undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.firstName === firstName && clg.lastName === lastName);
        }
        else if (email !== undefined && firstName === undefined && lastName !== undefined && collegeId !== undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.lastName === lastName && clg.collegeId === collegeId);
        }
        else if (email !== undefined && firstName !== undefined && lastName === undefined && collegeId !== undefined) {
            students = db.students.list().filter(clg => clg.email === email && clg.firstName === firstName && clg.collegeId === collegeId);
        }
        else if (email === undefined && firstName !== undefined && lastName !== undefined && collegeId !== undefined) {
            students = db.students.list().filter(clg => clg.firstName === firstName && clg.lastName === lastName && clg.collegeId === collegeId);
        }
        else {
            return [];
        }

        return students.map((student) => {
            return populateStudentAux(student);
        });
    },
    colleges: () => {
        const colleges = db.colleges.list();
        return colleges.map((college) => {
            return populateCollegeAux(college);
        });
    },
    college: (parent, { id }) => {
        const college = db.colleges.get(id);
        return populateCollegeAux(college);
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
            return populateCollegeAux(college);
        });
    },
    books: () => {
        const books = db.books.list();
        return books.map((book) => {
            return populateBookAux(book);
        });
    },
    book: (parent, { id }) => {
        const book = db.books.get(id);
        return populateBookAux(book);
    },
    booksBy: (parent, { search }) => {

        const name = search.name;
        const author = search.author;
        const collegeIds = search.collegeIds;

        let books = [];

        if (name !== undefined && author !== undefined && collegeIds !== undefined) {
            books = db.books.list().filter(clg => clg.name === name && clg.author === author && JSON.stringify(clg.collegeIds) === JSON.stringify(collegeIds));
        }
        else if (name !== undefined && author === undefined && collegeIds === undefined) {
            books = db.books.list().filter(clg => clg.name === name);
        }
        else if (name === undefined && author !== undefined && collegeIds === undefined) {
            books = db.books.list().filter(clg => clg.author === author);
        }
        else if (name === undefined && author === undefined && collegeIds !== undefined) {
            books = db.books.list().filter(clg => JSON.stringify(clg.collegeIds) === JSON.stringify(collegeIds));
        }
        else if (name !== undefined && author !== undefined && collegeIds === undefined) {
            books = db.books.list().filter(clg => clg.name === name && clg.author === author);
        }
        else if (name !== undefined && author === undefined && collegeIds !== undefined) {
            books = db.books.list().filter(clg => clg.name === name && JSON.stringify(clg.collegeIds) === JSON.stringify(collegeIds));
        }
        else if (name === undefined && author !== undefined && collegeIds !== undefined) {
            books = db.books.list().filter(clg => clg.author === author && JSON.stringify(clg.collegeIds) === JSON.stringify(collegeIds));
        }
        else {
            return [];
        }

        return books.map((book) => {
            return populateBookAux(book);
        });
    },
}

const addStudentAux = (student) => {
    const studentSerialised = JSON.stringify(student);
    const encrypted = crypto.MD5(studentSerialised).toString(crypto.enc.Hex);
    const existingStudentRaw = db.students.get(encrypted);
    if (existingStudentRaw !== undefined) {
        const existingStudent = JSON.parse(JSON.stringify(existingStudentRaw));
        return populateStudentAux(existingStudent);
    }
    else {
        student.id = encrypted;
        db.students.create(student);
        return populateStudentAux(student);
    }
};

const updateStudentAux = (id, student) => {
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
        return populateStudentAux(student);
    }

    return;
};

const Mutation = {
    addStudent: (parent, { student }) => {
        return addStudentAux(student);
    },
    addStudents: (parent, { students }) => {
        return students.map((student) => {
            return addStudentAux(student);
        });
    },
    updateStudent: (parent, { id, student }) => {
        return updateStudentAux(id, student);
    },
    updateStudents: (parent, { students }) => {
        return students.map(({id, student}) => {
            return updateStudentAux(id, student);
        }).filter(s => s !== undefined);
    },
}

 module.exports = {Query, Mutation}