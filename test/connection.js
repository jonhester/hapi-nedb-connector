'use strict';

var Hapi = require('hapi');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var expect = require('code').expect;

describe('Hapi server', function() {

    var server;

  beforeEach(function(done) {
    server = new Hapi.Server();
    done();
  });

  it('should reject invalid options', function(done) {
    server.register({
      register: require('../'),
      options: {
        dirrectorry: 'blah'
      }
    }, function(err) {
      expect(err).to.exist();
      done();
    });
  });

  it('should reject invalid autoCompactionInterval options', function(done) {
    server.register({
      register: require('../'),
      options: {
        autoCompactionInterval: 100
      }
    }, function(err) {
      expect(err).to.exist();
      done();
    });
  });

  it('should be able to create the directory', function(done) {
    server.register({
      register: require('../'),
      options: {
        directory: 'test/'
      }
    }, function(err) {
      expect(err).to.not.exist();
      done();
    });
  });

  it('should be able to create in memory database with empty options', function(done) {
    server.connection();
    server.register({
      register: require('../')
    }, function(err) {
      expect(err).to.not.exist();
      server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
          var plugin = request.server.plugins['hapi-nedb-connector'];
          plugin.db('test').insert({id: 1, test: [1,2,3]});

          done();
        }
      });

      server.inject({
        method: 'GET',
        url: '/'
      }, function() {});
    });
  });

  // it('should be able to register plugin with URL and settings', function(done) {
  //   server.register({
  //     register: require('../'),
  //     options: {
  //       url: 'mongodb://localhost:27017',
  //       settings: {
  //         db: {
  //           /* eslint-disable camelcase */
  //           native_parser: false
  //           /* eslint-enable camelcase */
  //         }
  //       }
  //     }
  //   }, function(err) {
  //     expect(err).to.not.exist();
  //     done();
  //   });
  // });

  it('should be able to find the plugin exposed objects', function(done) {
    server.connection();
    server.register({
      register: require('../'),
      options: {
        directory: 'tmp/',
        autoCompactionInterval: 5000
      }
    }, function(err) {
      expect(err).to.not.exist();

      server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
          var plugin = request.server.plugins['hapi-nedb-connector'];
          plugin.db('test').insert({id: 1, test: [1,2,3]});

          expect(plugin.db).to.exist();
          
          plugin.db('test').find({ id: 1 }, function (err, docs) {

            expect(docs[0]).to.exist();
            expect(docs[0].test).to.deep.equal([1,2,3]);  
          });

          plugin.stopAutoCompaction('test');
          plugin.stopAutoCompaction('tests');
          plugin.compact('test');
          plugin.compact('tests');

          done();
        }
      });

      server.inject({
        method: 'GET',
        url: '/'
      }, function() {});
    });
  });

});