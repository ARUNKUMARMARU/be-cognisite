const express = require('express');
const cors = require('cors');
const routes = require('./Routes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/user', routes)
app.use('/api/password', routes)


module.exports = app;