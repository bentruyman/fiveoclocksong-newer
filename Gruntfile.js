module.exports = function( grunt ) {
  'use strict';
  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/components'
    },

    // Coffee to JS compilation
    coffee: {
      compile: {
        files: {
          'temp/scripts/*.js': 'app/scripts/**/*.coffee'
        },
        options: {
          basePath: 'app/scripts'
        }
      }
    },

    // compile .scss/.sass to .css using Compass
    compass: {
      dist: {
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        options: {
          config: 'config.rb'
        }
      }
    },

    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // default watch configuration
    watch: {
      compass: {
        files: [
          'app/styles/**/*.{scss,sass}'
        ],
        tasks: 'compass reload'
      },
      reload: {
        files: [
          'app/*.html',
          'app/styles/**/*.css',
          'app/scripts/**/*.js',
          'app/images/**/*'
        ],
        tasks: 'reload'
      }
    },

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: [
        'Gruntfile.js',
        'app/scripts/**/*.js',
        'spec/**/*.js'
      ]
    },

    // specifying JSHint options and globals
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
    jshint: {
      options: {
        curly: true,
        devel: true,
        eqeqeq: true,
        es5: true,
        expr: true,
        forin: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        predef: [
          // dom
          'navigator',
          'window',
          'clearTimeout',
          'clearInterval',
          'setTimeout',
          'setInterval',
          // requirejs
          'define',
          // misc
          '_',
          'humana'
        ],
        smarttabs: true,
        supernew: true,
        trailing: true
      },
      globals: {
        jQuery: true
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'styles/main.css': ['styles/**/*.css']
    },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'scripts/**/*.js',
      css: 'styles/**/*.css'
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'index.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: 'images/**'
    },

    requirejs: {
      // almond specific contents
      // *insert almond in all your modules
      almond: true,
      // *replace require script calls, with the almond modules
      // in the following files
      replaceRequireScript: [{
        files: ['build/index.html'],
        module: 'main'
      }],
      // "normal" require config
      // *create at least a 'main' module
      // thats necessary for using the almond auto insertion
      modules: [{name: 'main'}],
      dir: 'build',
      appDir: 'src',
      baseUrl: 'js',
      paths: {
        underscore: '../vendor/underscore',
        jquery    : '../vendor/jquery',
        backbone  : '../vendor/backbone'
      },
      pragmas: {
        doExclude: true
      },
      skipModuleInsertion: false,
      optimizeAllPluginResources: true,
      findNestedDependencies: true
    },

    // While Yeoman handles concat/min when using
    // usemin blocks, you can still use them manually
    concat: {
      dist: ''
    },

    min: {
      dist: ''
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');

};
