module.exports = function(grunt) {
    grunt.initConfig({
        coveralls: {
            teaspoon_coverage: {
                src: 'coverage/default/lcov.info'
            }
        }
    });

    grunt.loadNpmTasks('grunt-coveralls');
};
