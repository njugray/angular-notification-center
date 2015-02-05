module.exports = function (grunt) {

  /**
   * Configuration.
   */

  grunt.initConfig({

    jshint: {
      javascript: ['angular-notification-center.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
    uglify: {
      default: {
        options: {
          sourceMap: 'angular-notification-center.min.map',
          sourceMappingURL: 'angular-notification-center.min.map'
        },
        files: {
          'angular-notification-center.min.js': 'angular-notification-center.js'
        }
      }
    }
  });

  /**
   * Tasks.
   */

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.registerTask('default', ['jshint', 'uglify']);
};