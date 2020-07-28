const express = require('express');
const path = require('path');
const { respondeNotFound, respondInternalError } = require('./helpers');

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const gameRouter = require('./routes/game');
const cookieConfig = require('./cookieConfig');

const app = express();

app.use(cookieParser());
app.use(cookieSession({

    name: 'session',
    keys: cookieConfig.keySession,
    maxAge: cookieConfig.maxAgeSession,

}))
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", gameRouter);

// Error handling 

app.get('*', (req, res) => {

    respondeNotFound(res);
})

app.use((err, req, res, next) => {

    respondInternalError(err, res);
})

exports.app = app;