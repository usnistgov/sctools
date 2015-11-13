// this is the grunt script that lints the javascript, copies libraries, and starts the server
module.exports = function (grunt) {

	grunt.initConfig({
	
		pkg: grunt.file.readJSON('package.json'),
		
		// executes the node server
		nodemon: {
			dev: {
				script: 'server.js'
			}
		},

		// copies front-end third-party files (ex: angular.js) into the public/lib folder
		bower: {
		       dev: {
		       	    dest: 'public/lib'
			}
		},

		// checks my javascript files for bugs
		jshint: {
			myFiles: ['Gruntfile.js', 'public/model/*.js', 'public/*.js', 'public/services/*.js', 'server.js']
		}	

	});
	
	// load the tasks
	grunt.loadNpmTasks('grunt-bower');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// set the tasks to be executed when 'grunt' is called
	grunt.registerTask('default', ['jshint', 'bower','nodemon']);

};
