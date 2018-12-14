/*jshint node:true*/
'use strict';
var cors = require('cors');
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var errorHandler = require('./utils/errorHandler')();
var four0four = require('./utils/404')();
var favicon = require('serve-favicon');
var logger = require('morgan');
var ntlm = require('express-ntlm');
var server = require('http').createServer(app);

var port = process.env.PORT || 8080;
var routes;
var environment = process.env.NODE_ENV;

//APP USE
app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
app.use(errorHandler.init);

var whitelist = [
    'http://localhost:8081',      //this is my front-end url for development
	'http://localhost:4200'
];


var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors());
app.options('*', cors(corsOptions));

//app.use(express.static(path.join(__dirname,"../client/app/")));

routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./.tmp'));
        // All the assets are served at this point.
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

/* In conjunction with Express
    Starting with 3.0, express applications have become request handler functions that you pass to http or http Server instances. 
    You need to pass the Server to socket.io, and not the express application function. Also make sure to call .listen on the server, not the app. 
*/
server.listen(port, function() {

    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});