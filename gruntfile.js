module.exports = function (grunt) {
/*
  grunt.loadNpmTasks('grunt-dojo');
//  grunt.loadNpmTasks('dojo');
  grunt.loadNpmTasks('grunt-kommando');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-watch');
*/

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var path = require('path');

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),

    express: {
      test: {
        options: {
          port: 3000,
          hostname: '*',
          server: path.resolve(__dirname + '/api.js'),
          bases: [ './public', './*.js' ],
          livereload: true,
          /*serverreload: true,*/
          showStack: true
        }
      },
      dev: {
        options: {
          port: 3000,
          hostname: '*',
          server: path.resolve(__dirname + '/api.js'),
          bases: [ './public', './*.js' ],
          livereload: true,
          /*serverreload: true,*/
          showStack: true
        }
      },
      livereload: {
        options: {
          server: path.resolve('./api.js'),
          livereload: true,
          serverreload: true,
          bases: [path.resolve('./*.js'), './public']
        }
      }
    },

    watch: {
      express: {
        files:  [ './*.js', 'public' ],
        //tasks:  [ 'test' ],
        options: {
          livereload : true,
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec'
      },
      all: {
        src: ['./tests/*Test.js']
      }
    }
  });

  grunt.registerTask('dev', ['express:dev', 'watch']);
  grunt.registerTask('testdev', ['express:test', 'watch']);
  grunt.registerTask('test', ['express:test', 'mochaTest']);

  // grunt.registerTask('test', ['kommando:configSeleniumWebdriverMocha']);
  /*grunt.registerTask('server', ['express:server', 'express-keepalive']);*/
};
