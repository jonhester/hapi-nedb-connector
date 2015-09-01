# hapi-nedb-connector [![NPM version](http://img.shields.io/npm/v/hapi-nedb-connector.svg)](https://www.npmjs.com/package/hapi-nedb-connector) [![Build Status](https://travis-ci.org/jonhester/hapi-nedb-connector.svg?branch=v0.0.2)](https://travis-ci.org/jonhester/hapi-nedb-connector)
A simple connector for hapi and nedb

## Installation

```
npm install hapi-nedb-connector
```

## Usage
```
var Hapi = require("hapi");

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register({
    register: require('hapi-nedb-connector'),
    options: {
        directory: 'data/'
    }
}, function (err) {
    
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            var db = server.plugins['hapi-nedb-connector'].db;
            
            db('deployments').insert(deployment, function(err, newDeployment) {
					      child.send({repo: request.payload.repo, hash: request.payload.hash});
					      reply({message: 'build started'});
				    });
				    
            reply('Hello, world!');
        }
    });
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

```
