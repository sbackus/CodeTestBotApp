//= require application
//= require sinon
//= require sinon-chai
//= require chai-as-promised

window.CONFIG = {};

CodeTestBotApp.setupForTesting();

function testing() {
    var helper = {
        container: function() {
            return CodeTestBotApp.__container__;
        },
        dataStore: function() {
            return helper.controller('application').get('dataStore');
        },
        controller: function(name) {
            return helper.container().lookup('controller:' + name);
        },
        route: function(name) {
            return helper.container().lookup('route:' + name);
        }
    };

    return helper;
}