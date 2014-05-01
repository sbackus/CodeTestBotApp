/* globals FileReader */

export default Ember.TextField.extend({
    tagName: 'input',
    attributeBindings: ['name'],
    type: 'file',
    file: null,
    change: function(event) {
        var self = this;
        var reader = new FileReader();
        reader.onload = function(event) {
            Ember.run(function() {
                self.set('file', event.target.result);
            });
        };

        return reader.readAsDataURL(event.target.files[0]);
    }
});