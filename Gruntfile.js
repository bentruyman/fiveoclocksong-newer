module.exports = function(grunt) {
  'use strict';
  
  grunt.initConfig({
    
    watch: {
      files: ['<config:jshint.all>'],
      tasks: ['jshint']
    },
    
    jshint: {
      options: {
        "es5": true,
        "browser": true,
        "curly": true,
        "devel": true,
        "eqeqeq": true,
        "expr": true,
        "forin": true,
        "immed": true,
        "latedef": false,
        "newcap": true,
        "noarg": true,
        "scripturl": true,
        "smarttabs": true,
        "supernew": true,
        "trailing": true,
        "unused": false
      },
      all: [
        'Gruntfile.js',
        'client/code/app/**/*.js',
        'server/**/*.js'
      ]
    }
  });
  
  grunt.registerTask('default', 'jshint');
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.loadTasks('tasks');

};
