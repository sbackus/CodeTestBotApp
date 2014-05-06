import resolver from './resolver';

// TODO: Remove when ember-qunit/qunit-bdd situation is sorted out.
// Temporary hack that follows the proposed API for BDD test frameworks,
// i.e. describe('Some Controller', testFor('controller:some/controller', function() { ... }));
// Provides a this.subject() helper like ember-qunit gives with moduleFor.
export default function testFor(fullName, body) {
    function factory() {
        var container = isolatedContainer([fullName]);
        return container.lookupFactory(fullName);
    }

    return function() {
        helper('subject', function(options) {
            return factory().create(options);
        });

        body();
    };
}

// Copied from https://github.com/rpflorence/ember-qunit/blob/master/lib/isolated-container.js
function isolatedContainer(fullNames) {
    var container = new Ember.Container();
    container.optionsForType('component', { singleton: false });
    container.optionsForType('view', { singleton: false });
    container.optionsForType('template', { instantiate: false });
    container.optionsForType('helper', { instantiate: false });
    container.register('component-lookup:main', Ember.ComponentLookup);
    for (var i = fullNames.length; i > 0; i--) {
        var fullName = fullNames[i - 1];
        container.register(fullName, resolver.resolve(fullName));
    }
    return container;
}
