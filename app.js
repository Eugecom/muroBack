const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const commentsRoutes = require('./routes/commentsRoutes.js');

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use('/api', commentsRoutes);

module.exports = { app }