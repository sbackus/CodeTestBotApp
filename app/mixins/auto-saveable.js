
export default Ember.Mixin.create({
    __bufferedProperties__: {},

    autoSaveWait: 2000,

    setUnknownProperty: function(key, value) {
        this.__bufferedProperties__[key] = value;

        if (this.get('canSave')) {
            this.tryAutoSave();
        } else {
            this.get('content').one('isLoaded', this, this.tryAutoSave);
        }
    },

    tryAutoSave: function() {
        this.get('content').setProperties(this.__bufferedProperties__);
        this.__bufferedProperties__ = {};
        Ember.run.debounce(this, this.save, this.get('autoSaveWait'));
    },

    isBusy: Ember.computed.any('isSaving'),
    canSave: Ember.computed.not('isBusy')
});

