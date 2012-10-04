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
        files: ['temp/index.html'],
        module: 'scripts/main'
      }],
      paths: {
        async:  'vendor/requirejs-plugins/async',
        jade:   'vendor/requirejs-plugins/jade',
        json:   'vendor/requirejs-plugins/json',
        text:   'vendor/requirejs/text',
        jquery: 'vendor/jquery'
      },
      pragmas: {
          doExclude: true
      },
      skipModuleInsertion: false,
      optimizeAllPluginResources: true,
      findNestedDependencies: true
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
  grunt.loadNpmTasks('grunt-requirejs');
  
  grunt.loadTasks('tasks');

};
