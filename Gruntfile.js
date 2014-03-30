module.exports = function(grunt) {
    grunt.initConfig({
        coveralls: {
            options: {
                src: 'coverage/lcov.info'
            }
        }
    });

    grunt.loadNpmTasks('grunt-coveralls');
};
