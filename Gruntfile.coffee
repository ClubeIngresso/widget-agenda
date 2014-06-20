'use strict';

module.exports = (grunt) ->
	require("time-grunt") grunt
	require("load-grunt-tasks") grunt
	grunt.initConfig
		pkg: grunt.file.readJSON("package.json")

		files:
			js: ["src/js/*.js"]
			scss: ["src/scss/*.scss"]
			all: ["src/js/*.js", "src/scss/*.scss"]

		jshint:
			options:
				jshintrc: ".jshintrc"
				ignores: ["node_modules/**"]

			uses_defaults: "<%= files.js %>"

		jscs:
			uses_defaults: "<%= files.js %>"

		compass:
			dist:
				options:
					sassDir: "src/scss"
					cssDir: "example"
			build:
				options:
					sassDir: "src/scss"
					cssDir: "."
					environment: "production"

		uglify:
			createMin:
				files:
					"example/agenda-clubeingresso.min.js": ["src/js/agenda-clubeingresso.js"]
			build:
				files:
					"agenda-clubeingresso.js": ["src/js/agenda-clubeingresso.js"]

		watch:
			options:
				nospawn: true
				livereload: true

			compass:
				files: "<%= files.scss %>"
				tasks: ["compass:dist"]

			uglify:
				files: "<%= files.js %>"
				tasks: ["uglify:createMin"]

	grunt.registerTask "test", ["jshint", "jscs"]
	grunt.registerTask "build", ["test", "compass:build", "uglify:build"]
	grunt.registerTask "default", ["compass:dist", "uglify", "test", "watch"]
