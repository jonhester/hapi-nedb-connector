# hapi-nedb-connector [![NPM version](http://img.shields.io/npm/v/hapi-nedb-connector.svg)](https://www.npmjs.com/package/hapi-nedb-connector) [![Build Status](https://travis-ci.org/jonhester/hapi-nedb-connector.svg?branch=v0.0.2)](https://travis-ci.org/jonhester/hapi-nedb-connector)
A simple connector for hapi and nedb

## Installation

```
npm install hapi-nedb-connector
```

## Usage
```js
var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

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
			// Access plugin
			var db = server.plugins['hapi-nedb-connector'].db;
			
			// Use requests database and create requests database if it does not exist
			db('requests').insert(request.info, function(err, newRequest) {
				reply({message: 'request added to database'});
			});

		}
	});
});

// Start the server
server.start(function() {
     console.log('Server running at:', server.info.uri);
});


```
