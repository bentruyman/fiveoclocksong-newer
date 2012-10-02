module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: [
        'public/javascripts/*.js',
        'public/javascripts/services/*.js',
        'public/javascripts/widgets/*.js'
      ]
    },
    watch: {
      files: [
        '<config:lint.files>',
        'sass/fiveoclocksong.scss',
        'sass/src/*.scss'
      ],
      tasks: ['exec:dev']
    },
    exec: {
      dev: {
        command: 'compass compile sass/fiveoclocksong.scss -c compass.dev.rb'
      },
      prod: {
        command: 'compass compile sass/fiveoclocksong.scss -c compass.prod.rb'
      }
    },
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
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint exec:dev');

  // Third-party tasks.
  grunt.loadNpmTasks('grunt-exec');

  // Project tasks.
  grunt.registerTask('build', 'exec:dev');

};
