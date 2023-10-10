const express = require("express");
const app = express();
const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const { requestLogger } = require("./utils/middleware")

// Routes
const authRouter = require('./controllers/auth.js')

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

// Connecting to database
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connection to MongoDB:", error.message);
    });

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/auth', authRouter)
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/build/index.html'));
});
module.exports = app;