var express = require("express");
var path = require('path');
var fs = require('fs');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var conf = require('config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');
var sprintf = require("sprintf-js").sprintf;
var httpProxy = require("http-proxy");
var http = require('http');
var fs = require('fs');
var filename = 'target.json';
var mysql = require('mysql');
var Pool = require('generic-pool').Pool;
var expressValidator = require('express-validator');
var Sequelize = require('sequelize');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
const fileUpload = require('express-fileupload');

global.appRoot = path.resolve(__dirname);



var PORT = conf.get('port');
global.mongoUrl = conf.get('mongo-url');
global.uploadsDir = conf.get('upload-dir');
var app = express();




console.log(sprintf("using env: [%s]", app.get('env')));
app.set('view engine', 'html');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
// app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(expressValidator());


var dump = require('./routes/dump');
app.use(dump);






app.listen(PORT) ;
console.log(sprintf('Listening on port %s...', PORT));
