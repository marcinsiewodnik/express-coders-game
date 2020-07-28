const { app } = require('../app');

const { connect, disconnect } = require("../models/client.js");

const port = process.env.PORT || 3000;

app.listen(port, () => {

    console.log(`Listening on port ${port}`);
});

// connecting to the database

connect();