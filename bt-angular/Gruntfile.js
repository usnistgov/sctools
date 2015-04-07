module.exports = function (grunt) {

	grunt.initConfig({
	
		pkg: grunt.file.readJSON('package.json'),
		
		nodemon: {
			dev: {
				script: 'server.js'
			}
		},

		bower: {
		       dev: {
		       	    dest: 'public/lib'
			}
		},

		jshint: {
			myFiles: ['Gruntfile.js', 'public/model/*.js', 'public/*.js', 'public/services/*.js']
		}	

	});
	
	grunt.loadNpmTasks('grunt-bower');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'bower','nodemon']);

};
