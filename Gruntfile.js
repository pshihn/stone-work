module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    "rollup": {
      options: {},
      files: {
        'dest': "dist/<%= pkg.name %>.es6.js",
        'src': "index.js"
      },
    }
  });

  grunt.loadNpmTasks('grunt-rollup');
  grunt.registerTask('default', ['rollup']);
};