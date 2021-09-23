const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
require("dotenv").config();

const indexRouter = require('./api/index');


const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log(`Mongoose connected to ${MONGODB_URI}`);
    })
    .catch((e) => {
        console.log({ e });
    });


app.use('/api', indexRouter);


module.exports = app;
