/**
 * `watch`
 *
 * ---------------------------------------------------------------
 *
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * Watch for changes on:
 * - files in the `assets` folder
 * - the `tasks/pipeline.js` file
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-watch
 *
 */
module.exports = function(grunt) {

  grunt.config.set('watch', {
    sass: {
      // Assets to watch:
      files: ['frontend/sass/**'],
      tasks: ['sass:development']
    },
    copy: {
      // Assets to watch:
      files: ['frontend/views/**','frontend/img/**','frontend/fonts/**'],
      tasks: ['copy:development']
    },
    js: {
      // Assets to watch:
      files: ['frontend/js/**'],
      tasks: ['copy:jsDevelopment']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};
