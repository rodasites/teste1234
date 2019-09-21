var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const router = express.Router();
var bodyParser = require('body-parser');

//Rotas
var app = express();
var pessoa = require('./domain/pessoa/pessoa.routes');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


app.use('/api/pessoa', pessoa);

module.exports = app;
