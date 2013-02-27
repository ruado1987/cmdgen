module.exports = function( grunt ) {

    "use strict";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        nodeunit: {
            all: ['test/*.js']
        },
		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
		}
    });

    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'nodeunit', 'uglify']);
	grunt.registerTask('travis', ['jshint', 'nodeunit']);
};