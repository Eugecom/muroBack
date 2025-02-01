const express = require('express');
const bodyParser = require('body-parser');
const commentsRoutes = require('./routes/commentsRoutes.js');

const app = express();

app.use(bodyParser.json());

app.use('/api', commentsRoutes);

module.exports = { app }