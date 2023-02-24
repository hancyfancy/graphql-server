# graphql-server

The development server used to query and mutate data. The server currently uses a fake database to store data, which can be replaced with a document database such as MongoDb. The fake database files can be found in the `data` folder.

## Development database

Run `npm start` to launch the development database. Navigate to `http://localhost:9000/graphiql` to run queries/mutations manually and check schema.
