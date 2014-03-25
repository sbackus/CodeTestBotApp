//= require application
//= require sinon
//= require sinon-chai
CodeTestBotApp.setupForTesting();

//chai.use(spies);

function testing() {
    var helper = {
        container: function() {
            return CodeTestBotApp.__container__;
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