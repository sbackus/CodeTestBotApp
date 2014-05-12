
Ember.Test.registerHelper('shouldContainText', function(app, selector, text, context) {
    var el = findWithAssert(selector, context);
    var index = el.text().indexOf(text);
    ok(index !== -1, 'expected text not found');
});
