var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var chalk = require('chalk');

var cwd = 'docs';
var port = 9001;

app.use('/', function (request, response) {
    
    console.log('Received request for URL: ' + request.url);

    var filePath = request.url.split("?").shift()

    if (filePath == '/') {
        filePath = cwd + '/index.html';
    }
    else {
        filePath = cwd + filePath;
    }

    fs.readFile(filePath, null, function(error, data){
        
        if(error){
            response.writeHead(404);
            response.write('File not found.');
        }
        else{
            response.writeHead(200);
            response.write(data);
        }
        
        response.end();
    });
    
});

console.log('Server address: ' + chalk.yellow('http://127.0.0.1:' + port + '/'));
console.log('Server running... press ctrl-c to stop.');

app.listen(port);