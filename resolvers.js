const db = require('./db');
const crypto = require('crypto-js');

const populateStudentAux = (student) => {
    student.college = JSON.parse(JSON.stringify(db.colleges.get(student.collegeId)));
    student.college.books = student.college.bookIds.map((bookId) => {
        return JSON.parse(JSON.stringify(db.books.get(bookId)));
    });
    return student;
};

const populateBookAux = (book) => {
    book.colleges = book.collegeIds.map((collegeId) => {
        return JSON.parse(JSON.stringify(db.colleges.get(collegeId)));
    });

    book.colleges.map((college) => {
        const students = college.studentIds.map((studentId) => {
            return JSON.parse(JSON.stringify(db.students.get(studentId)));
        });

        college.students = students;
    });

    return book;
};

const populateCollegeAux = (college) => {
    college.books = college.bookIds.map((bookId) => {
        return JSON.parse(JSON.stringify(db.books.get(bookId)));
    });
    college.students = college.studentIds.map((studentId) => {
        return JSON.parse(JSON.stringify(db.students.get(studentId)));
    });
    return college;
};

const populateFilteredObjectsAux = (objs, filteredObjs) => {
    filteredObjs.map((filteredObj) => {
        if (!objs.map((obj) => obj.id).includes(filteredObj.id)) {
            objs.push(filteredObj);
        }
    });
};

const Query = {
    students: () => {
        const students = db.students.list();
        return students.map((student) => {
            return populateStudentAux(student);
        });
    },
    student: (parent, { id }) => {
        const student = JSON.parse(JSON.stringify(db.students.get(id)));
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
            populateFilteredObjectsAux(students, filteredStudents);
        }

        if (firstName != undefined) {
            const filteredStudents = db.students.list().filter(clg => clg.firstName === firstName);
            populateFilteredObjectsAux(students, filteredStudents);
        }

        if (lastName != undefined) {
            const filteredStudents = db.students.list().filter(clg => clg.lastName === lastName);
            populateFilteredObjectsAux(students, filteredStudents);
        }

        if (collegeId != undefined) {
            const filteredStudents = db.students.list().filter(clg => clg.collegeId === collegeId);
            populateFilteredObjectsAux(students, filteredStudents);
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
        const college = JSON.parse(JSON.stringify(db.colleges.get(id)));
        return populateCollegeAux(college);
    },
    collegesBy: (parent, { search }) => {

        const name = search.name;
        const location = search.location;
        const rating = search.rating;
        const bookIds = search.bookIds;
        const studentIds = search.studentIds;

        let colleges = [];

        if (name !== undefined) {
            const filteredColleges = db.colleges.list().filter(clg => clg.name === name);
            populateFilteredObjectsAux(colleges, filteredColleges);
        }

        if (location !== undefined) {
            const filteredColleges = db.colleges.list().filter(clg => clg.location === location);
            populateFilteredObjectsAux(colleges, filteredColleges);
        }

        if (rating !== undefined) {
            const filteredColleges = db.colleges.list().filter(clg => clg.rating === rating);
            populateFilteredObjectsAux(colleges, filteredColleges);
        }

        if (bookIds !== undefined) {
            const filteredColleges = db.colleges.list().filter(clg => JSON.stringify(clg.bookIds) === JSON.stringify(bookIds));
            populateFilteredObjectsAux(colleges, filteredColleges);
        }

        if (studentIds !== undefined) {
            const filteredColleges = db.colleges.list().filter(clg => JSON.stringify(clg.studentIds) === JSON.stringify(studentIds));
            populateFilteredObjectsAux(colleges, filteredColleges);
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
        const book = JSON.parse(JSON.stringify(db.books.get(id)));
        return populateBookAux(book);
    },
    booksBy: (parent, { search }) => {

        const name = search.name;
        const author = search.author;
        const collegeIds = search.collegeIds;

        const books = [];

        if (name !== undefined) {
            const filteredBooks = db.books.list().filter(clg => clg.name === name);
            populateFilteredObjectsAux(books, filteredBooks);
        }

        if (author !== undefined) {
            const filteredBooks = db.books.list().filter(clg => clg.author === author);
            populateFilteredObjectsAux(books, filteredBooks);

        }

        if (collegeIds !== undefined) {
            const filteredBooks = db.books.list().filter(clg => JSON.stringify(clg.collegeIds) === JSON.stringify(collegeIds));
            populateFilteredObjectsAux(books, filteredBooks);
        }

        return books.map((book) => {
            return populateBookAux(book);
        });
    },
}

const addStudentAux = (student) => {
    student.email = student.email.trim();
    student.firstName = student.firstName.trim();
    student.lastName = student.lastName.trim();
    student.collegeId = student.collegeId.trim();

    if (student.email === "" || student.firstName === "" || student.lastName === "" || student.collegeId === "") {
        return;
    }

    const copy = JSON.parse(JSON.stringify(student));
    copy.collegeId = undefined;
    const serialised = JSON.stringify(copy);
    const encrypted = crypto.MD5(serialised).toString(crypto.enc.Hex);
    const existingRaw = db.students.get(encrypted);
    if (existingRaw !== undefined) {
        const existing = JSON.parse(JSON.stringify(existingRaw));
        db.students.delete(existing.id);
        existing.collegeId = student.collegeId;
        db.students.create(existing);
        return populateStudentAux(existing);
    }
    else {
        student.id = encrypted;
        db.students.create(student);
        return populateStudentAux(student);
    }
};

const updateStudentAux = (id, student) => {
    const existingRaw = db.students.get(id);
    if (existingRaw !== undefined) {
        const existing = JSON.parse(JSON.stringify(existingRaw));
        db.students.delete(id);

        if (student.email === undefined) {
            student.email = existing.email;
        }

        if (student.lastName === undefined) {
            student.lastName = existing.lastName;
        }

        if (student.firstName === undefined) {
            student.firstName = existing.firstName;
        }

        if (student.collegeId === undefined) {
            student.collegeId = existing.collegeId;
        }

        const copy = JSON.parse(JSON.stringify(student));
        copy.collegeId = undefined;
        const serialised = JSON.stringify(copy);
        const encrypted = crypto.MD5(serialised).toString(crypto.enc.Hex);
        student.id = encrypted;

        db.students.create(student);
        return populateStudentAux(student);
    }

    return;
};

const addBookAux = (book) => {
    book.name = book.name.trim();
    book.author = book.author.trim();
    book.collegeIds = book.collegeIds.filter(s => s.trim() !== "");

    if (book.name === "" || book.author === "") {
        return;
    }

    const copy = JSON.parse(JSON.stringify(book));
    copy.collegeIds = undefined;
    const serialised = JSON.stringify(copy);
    const encrypted = crypto.MD5(serialised).toString(crypto.enc.Hex);
    const existingRaw = db.books.get(encrypted);
    if (existingRaw !== undefined) {
        const existing = JSON.parse(JSON.stringify(existingRaw));
        db.books.delete(existing.id);
        existing.collegeIds = book.collegeIds;
        db.books.create(existing);
        return populateBookAux(existing);
    }
    else {
        book.id = encrypted;
        db.books.create(book);
        return populateBookAux(book);
    }
};

const updateBookAux = (id, book) => {
    const existingRaw = db.books.get(id);
    if (existingRaw !== undefined) {
        const existing = JSON.parse(JSON.stringify(existingRaw));
        db.books.delete(id);

        if (book.name === undefined) {
            book.name = existing.name;
        }

        if (book.author === undefined) {
            book.author = existing.author;
        }

        if (book.collegeIds === undefined) {
            book.collegeIds = existing.collegeIds;
        }

        const copy = JSON.parse(JSON.stringify(book));
        copy.collegeIds = undefined;
        const serialised = JSON.stringify(copy);
        const encrypted = crypto.MD5(serialised).toString(crypto.enc.Hex);
        book.id = encrypted;

        db.books.create(book);
        return populateBookAux(book);
    }

    return;
};

const addCollegeAux = (college) => {
    college.name = college.name.trim();
    college.location = college.location.trim();
    college.bookIds = college.bookIds.filter(s => s.trim() !== "");
    college.studentIds = college.studentIds.filter(s => s.trim() !== "");

    if (college.name === "" || college.location === "" || college.rating < 0) {
        return;
    }

    const copy = JSON.parse(JSON.stringify(college));
    copy.bookIds = undefined;
    copy.studentIds = undefined;
    const serialised = JSON.stringify(copy);
    const encrypted = crypto.MD5(serialised).toString(crypto.enc.Hex);
    const existingRaw = db.colleges.get(encrypted);
    if (existingRaw !== undefined) {
        const existing = JSON.parse(JSON.stringify(existingRaw));
        db.colleges.delete(existing.id);
        existing.bookIds = college.bookIds;
        existing.studentIds = college.studentIds;
        db.colleges.create(existing);
        return populateCollegeAux(existing);
    }
    else {
        college.id = encrypted;
        db.colleges.create(college);
        return populateCollegeAux(college);
    }
};

const updateCollegeAux = (id, college) => {
    const existingRaw = db.colleges.get(id);
    if (existingRaw !== undefined) {
        const existing = JSON.parse(JSON.stringify(existingRaw));
        db.colleges.delete(id);

        if (college.name === undefined) {
            college.name = existing.name;
        }

        if (college.location === undefined) {
            college.location = existing.location;
        }

        if (college.rating === undefined) {
            college.rating = existing.rating;
        }

        if (college.bookIds === undefined) {
            college.bookIds = existing.bookIds;
        }

        if (college.studentIds === undefined) {
            college.studentIds = existing.studentIds;
        }

        const copy = JSON.parse(JSON.stringify(college));
        copy.bookIds = undefined;
        copy.studentIds = undefined;
        const serialised = JSON.stringify(copy);
        const encrypted = crypto.MD5(serialised).toString(crypto.enc.Hex);
        college.id = encrypted;

        db.colleges.create(college);
        return populateCollegeAux(college);
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
        }).filter(s => s !== undefined);
    },
    updateStudent: (parent, { id, student }) => {
        return updateStudentAux(id, student);
    },
    updateStudents: (parent, { students }) => {
        return students.map(({id, student}) => {
            return updateStudentAux(id, student);
        }).filter(s => s !== undefined);
    },
    addBook: (parent, { book }) => {
        return addBookAux(book);
    },
    addBooks: (parent, { books }) => {
        return books.map((book) => {
            return addBookAux(book);
        }).filter(s => s !== undefined);
    },
    updateBook: (parent, { id, book }) => {
        return updateBookAux(id, book);
    },
    updateBooks: (parent, { books }) => {
        return books.map(({id, book}) => {
            return updateBookAux(id, book);
        }).filter(s => s !== undefined);
    },
    addCollege: (parent, { college }) => {
        return addCollegeAux(college);
    },
    addColleges: (parent, { colleges }) => {
        return colleges.map((college) => {
            return addCollegeAux(college);
        }).filter(s => s !== undefined);
    },
    updateCollege: (parent, { id, college }) => {
        return updateCollegeAux(id, college);
    },
    updateColleges: (parent, { colleges }) => {
        return colleges.map(({id, college}) => {
            return updateCollegeAux(id, college);
        }).filter(s => s !== undefined);
    },
}

 module.exports = {Query, Mutation}