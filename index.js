var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');

var cwd = 'docs';

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

console.log('URL: http://localhost:9001');

app.listen(9001);