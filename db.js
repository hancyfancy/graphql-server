//https://www.tutorialspoint.com/graphql/graphql_environment_setup.htm

const { DataStore } = require('notarealdb');

const store = new DataStore('./data');

module.exports = {
   students:store.collection('students'),
   colleges:store.collection('colleges'),
   books:store.collection('books')
};