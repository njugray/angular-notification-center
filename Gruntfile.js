module.exports = function (grunt) {

  /**
   * Configuration.
   */

  grunt.initConfig({

    jshint: {
      javascript: ['angular-notification.js'],
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
          sourceMap: 'angular-notification.min.map',
          sourceMappingURL: 'angular-notification.min.map'
        },
        files: {
          'angular-notification.min.js': 'angular-notification.js'
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