/* globals marked */
import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(raw) {
    var renderer = new marked.Renderer();
    return new Ember.Handlebars.SafeString(marked(raw, { renderer: renderer }));
});
