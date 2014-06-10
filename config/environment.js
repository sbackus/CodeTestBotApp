module.exports = function(environment) {
  var ENV = {
    baseURL: '/',
    EmberENV: {
        FEATURES: {
          // Here you can enable experimental features on an ember canary build
          // e.g. 'with-controller': true
            'query-params-new': true
        }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.environment = environment;

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_MODULE_RESOLVER = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.SERVER_HOST = 'http://localhost:3000';
    ENV.APP_HOST = 'http://localhost:4200';
    ENV.NEW_SESSION_URL = 'http://localhost:3000/sessions/new';
  }

  if (environment === 'production') {
      ENV.SERVER_HOST = 'https://codetestbotserver.herokuapp.com';
      ENV.APP_HOST = 'https://codetestbot.herokuapp.com';
      ENV.NEW_SESSION_URL = 'https://codetestbotserver.herokuapp.com/sessions/new';
  }

  return ENV;
};
