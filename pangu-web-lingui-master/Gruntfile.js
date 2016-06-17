module.exports = function expfunc(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

   /* concat : {

            domop : {

                src: ['public/js/view/flow.js', 'public/js/view/frame.js'],

                dest: 'public/js/view/flow_plugin.js'

            }

    },*/

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/js/view/flowchart-1.2.6.js',
        dest: 'public/js/view/flowchart-1.2.6.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
//  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
};
