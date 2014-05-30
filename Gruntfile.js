module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    path : {
        // in
        srcDirectory: "src/",
        src: '<%= path.srcDirectory =>**/*.js',
        testSrc: 'tests/*js',
        yabble: 'utils/yabbler/yabble.js',
        // out
        buildout: 'out/',
        main : '<%= pkg.name %>-<%= pkg.version %>.js',
        min : '<%= pkg.name %>-<%= pkg.version %>-min.js',
        // for CJS wrapping
        yabbler: 'utils/yabbler/yabbler.js',
        rhino: 'utils/rhino-js.jar',
        exampleDirectories: 'examples/**'
    },
    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {
          '<%= path.min %>' : [ '<%= path.main %>' ]
        }
      }
    },
    jshint: {
      files: ['<%= path.src %>'], // for another day: , '<%= path.testSrc %>'
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: false,
          console: true,
          module: true,
          require: true
        }
      }
    },
    exec: {
        yabbler: "java -jar <%= path.rhino %> <%= path.yabbler %> -i <%= path.srcDirectory %> -o <%= path.buildout %>"
    },
    clean: ["<%= path.buildout %>"],
    concat: {
        dist: {
            src: ["<%= path.yabble %>", "<%= path.buildout %>**/*.js"],
            dest: "<%= path.main %>"
        }
    }
  });

  grunt.registerTask('default', ['jshint', 'exec', 'concat', 'uglify:build', 'clean']);
  grunt.registerTask('build', ['exec', 'concat', 'uglify:build', 'clean']);
};