module.exports = function(config) {
    config.set({
        basePath: 'testDist',
        files: [
            'assets/*.js',
            'code-test-bot-app/tests/test-loader.js'
        ],

        browsers: ['PhantomJS'],
        singleRun: true,

        frameworks: ['qunit'],
        plugins: [
            'karma-qunit',
            'karma-phantomjs-launcher'
        ]
    });
};
