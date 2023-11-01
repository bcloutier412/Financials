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
const userRouter = require('./controllers/user.js')
const assetsRouter = require('./controllers/assets.js')

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

const whitelist = ['https://financial-tracker-client.vercel.app', 'http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'build')));

// Passport session config
app.use(session({
    secret: 'something that is random',
    cookie: {
        maxAge: 60000 * 60 * 24 * 30,
        sameSite: 'none',
        secure: true
    },
    resave: false,
    saveUninitialized: false,
    name: 'passport.userpass'
}))
app.use(passport.authenticate('session'));

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/assets', assetsRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.use(errorHandler)
module.exports = app;