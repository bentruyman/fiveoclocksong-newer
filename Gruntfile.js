module.exports = function(grunt) {
  'use strict';
  
  grunt.initConfig({
    
    clean: {
      all: ['temp', 'dist'],
      staging: 'temp',
      release: 'dist',
      'prep-staging': [
        'temp/scripts/services',
        'temp/scripts/vendor',
        'temp/scripts/widgets',
        'temp/styles/inc',
        'temp/styles/**/*.scss'
      ]
    },
    
    copy: {
      'to-staging': {
        files: {
          'temp/': 'app/**'
        }
      },
      'to-release': {
        files: {
          'dist/': 'temp/**'
        }
      }
    },
    
    watch: {
      files: ['<config:lint.files>', 'app/styles/**/*.scss'],
      tasks: ['compass:dev']
    },
    
    compass: {
      dev: {
        src: 'app/styles',
        dest: 'app/styles',
        linecomments: true,
        forcecompile: true,
        debugsass: true,
        images: 'app/images',
        relativeassets: false
      },
      prod: {
        src: 'temp/styles',
        dest: 'temp/styles',
        outputstyle: 'compressed',
        linecomments: false,
        forcecompile: true,
        debugsass: false,
        images: 'temp/images',
        relativeassets: false
      }
    },
    
    exec: {
      dev: {
        command: 'NODE_ENV=development node app',
        stdout: true
      },
      prod: {
        command: 'NODE_ENV=production node app',
        stdout: true
      }
    },
    
    lint: {
      files: [
        'app/scripts/*.js',
        'app/scripts/services/*.js',
        'app/scripts/widgets/*.js',
        'spec/**/*.js'
      ]
    },
    
    jshint: {
      options: {
        // environments
        "es5": true,
        "browser": true,
        // style options
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
        "unused": true
      }
    },
    
    requirejs: {
      almond: true,
      dir: 'temp',
      appDir: 'app',
      baseUrl: 'scripts',
      modules: [{ name: 'main' }],
      replaceRequireScript: [{
        files: ['temp/index.ejs'],
        module: 'scripts/main'
      }],
      paths: {
        // plugins
        jade:       'vendor/requirejs-plugins/jade',
        text:       'vendor/requirejs-plugins/text',
        // libraries
        backbone:   'vendor/backbone',
        jquery:     'vendor/jquery',
        underscore: 'vendor/underscore'
      },
      shim: {
        underscore: {
          exports: '_'
        },
        backbone: {
          deps: ['underscore', 'jquery'],
          exports: 'Backbone'
        }
      },
      skipModuleInsertion: false,
      optimizeAllPluginResources: true,
      findNestedDependencies: true,
      useSourceUrl: true
    },
    
    staging: 'temp',
    release: 'dist'
  });
  
  grunt.registerTask('default', 'lint');
  
  grunt.registerTask('release', [
    'copy:to-staging',
    'requirejs:js',
    'compass:prod',
    'clean:prep-staging',
    'clean:release',
    'copy:to-release'
  ]);
  
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-requirejs');
  
  grunt.loadTasks('tasks');

};
