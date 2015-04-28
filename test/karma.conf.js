// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-08-25 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['requirejs', 'jasmine'],

    // list of files / patterns to load in the browser
    files: [
        {pattern: 'lib/jquery/dist/jquery.js', included: false},
        {pattern: 'lib/jquery-ui/jquery-ui.js',included: false},
        {pattern: 'lib/angular/angular.js',included: false},
        {pattern: 'lib/angular-ui-router/release/angular-ui-router.js',included: false},
        {pattern: 'lib/angular-mocks/angular-mocks.js',included: false},
        {pattern: 'lib/angular-dragdrop/src/angular-dragdrop.js',included: false},
        {pattern: 'lib/angular-grid/ng-grid-2.0.12.debug.js',included: false},
        {pattern: 'lib/restangular/dist/restangular.js',included: false},
        {pattern: 'lib/lodash/dist/lodash.compat.js', included: false},
        {pattern: 'lib/require-css/css.js', included: false},
        {pattern: 'lib/requirejs-text/text.js', included: false},
        {pattern: 'common/**/*.js', included: false},
        {pattern: 'app/scripts/**/*.js', included: false},
        {pattern: 'app/app.js', included: false},
        {pattern: 'test/unit/**/*.js', included: false},
        'test/test-main.js'
//        'test/mock/**/*.js',
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS', 'Chrome'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-requirejs',
      'karma-htmlfile-reporter'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    reporters: ['progress', 'html'],

    htmlReporter: {
      outputFile: 'test/units.html'
    },

    type: 'html'
    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
