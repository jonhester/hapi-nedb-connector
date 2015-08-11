'use strict';

var Datastore = require('nedb');
var Joi = require('joi');

var schema = {
  directory: Joi.string(),
  autoCompactionInterval: Joi.number().integer().min(1900)
};

exports.register = function (plugin, options, next) {

  Joi.validate(options, schema, function (err, value) { 
    if (err) {
      return next(err);
    }

    var db, collections = {};

    db = {
      collection: function (collection) {
        if (!collections[collection]) {
          if (options.directory) {
            options.filename = options.directory + collection + '.nedb';
            options.autoload = true;
          }

          collections[collection] = new Datastore(options);

          if (options.directory && options.autoCompactionInterval) {
            collections[collection].persistence.setAutocompactionInterval(options.autoCompactionInterval)
          }
        }
        return collections[collection];
      }
    };

    var compact = function (collection) {
      if (collections[collection]) {
         return collections[collection].persistence.compactDatafile();
      }
    }

    var stopAutoCompaction = function (collection) {
      if (collections[collection]) {
        return collections[collection].persistence.stopAutocompaction();
      }
    }

    plugin.expose('compact', compact);
    plugin.expose('stopAutoCompaction', stopAutoCompaction);
    plugin.expose('db', db);

    next();
  });

};



exports.register.attributes = {
  pkg: require('../package.json')
};