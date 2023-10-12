const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const passport = require('passport');
var session = require('express-session');

// Utils
const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const { requestLogger, errorHandler } = require("./utils/middleware")

// Routes
const authRouter = require('./controllers/auth.js')

mongoose.set("strictQuery", false);

// Connecting to database
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connection to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'build')));

// Passport session config
app.use(session({
    secret: 'something that is random',
    cookie: {
        maxAge: 60000 * 60 * 24 * 30
    },
    resave: false,
    name: 'passport.userpass'
}))
app.use(passport.authenticate('session'));

app.use('/api/auth', authRouter)

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/build/index.html'));
});

app.use(errorHandler)
module.exports = app;