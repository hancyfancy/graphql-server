const db = require('./db');
const crypto = require('crypto-js');

const populateStudentAux = (student) => {
    student.college = db.colleges.get(student.collegeId);
    student.college.books = student.college.bookIds.map((bookId) => {
        return db.books.get(bookId);
    });
    return student;
};

const populateFilteredStudentsAux = (students, filteredStudents) => {
    filteredStudents.map((filteredStudent) => {
        if (!students.map((student) => student.id).includes(filteredStudent.id)) {
            students.push(filteredStudent);
        }
    });
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

const populateFilteredBooksAux = (books, filteredBooks) => {
    filteredBooks.map((filteredBook) => {
        if (!books.map((book) => book.id).includes(filteredBook.id)) {
            books.push(filteredBook);
        }
    });
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

        if (email != undefined) {
            const filteredStudents = db.students.list().filter(clg => clg.email === email);
            populateFilteredStudentsAux(students, filteredStudents);
        }

        if (firstName != undefined) {
            const filteredStudents = db.students.list().filter(clg => clg.firstName === firstName);
            populateFilteredStudentsAux(students, filteredStudents);
        }

        if (lastName != undefined) {
            const filteredStudents = db.students.list().filter(clg => clg.lastName === lastName);
            populateFilteredStudentsAux(students, filteredStudents);
        }

        if (collegeId != undefined) {
            const filteredStudents = db.students.list().filter(clg => clg.collegeId === collegeId);
            populateFilteredStudentsAux(students, filteredStudents);
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

        const books = [];

        if (name !== undefined) {
            const filteredBooks = db.books.list().filter(clg => clg.name === name);
            populateFilteredBooksAux(books, filteredBooks);
        }

        if (author !== undefined) {
            const filteredBooks = db.books.list().filter(clg => clg.author === author);
            populateFilteredBooksAux(books, filteredBooks);

        }

        if (collegeIds !== undefined) {
            const filteredBooks = db.books.list().filter(clg => JSON.stringify(clg.collegeIds) === JSON.stringify(collegeIds));
            populateFilteredBooksAux(books, filteredBooks);
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