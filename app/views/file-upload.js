/* globals FileReader */
import Ember from 'ember';

export default Ember.TextField.extend({
    tagName: 'input',
    attributeBindings: ['name'],
    type: 'file',
    file: null,
    fileName: null,
    change: function(event) {
        var self = this;
        var reader = new FileReader();
        reader.onload = function(event) {
            Ember.run(function() {
                self.set('file', event.target.result);
            });
        };
        self.set('fileName', event.target.files[0].name);
        return reader.readAsDataURL(event.target.files[0]);
    }
});
