window.CONFIG = window.CONFIG || {};

CodeTestBotApp.ApplicationAdapter = DS.ActiveModelAdapter.extend({
    host: CONFIG.SERVER_HOST
});

CodeTestBotApp.ApplicationStore = DS.Store.extend({
//    adapter: '_ams'
});
