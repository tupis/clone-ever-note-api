const express = require('express');
let cors = require('cors');
const path = require('path');
const logger = require('morgan');
// require("dotenv").config();
require('./config/database')


const notesRouter = require('./app/routes/notes')
const usersRouter = require('./app/routes/users');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/notes', notesRouter)


module.exports = app;