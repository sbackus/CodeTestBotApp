import AutoSaveable from 'code-test-bot-app/mixins/auto-saveable';

describe('AutoSaveable', function() {
    var DummyClass = Ember.ObjectProxy.extend(AutoSaveable, { isSaving: false, save: function() {} });
    var instance, content;
    before(function() {
        content = Ember.Object.createWithMixins(Ember.Evented);
        instance = DummyClass.create({ content: content });
    });

    describe('#setUnknownProperty', function() {
        context('when already saving', function() {
            before(function() {
                instance.set('isSaving', true);
                sinon.stub(content, 'one');
            });

            it('stores the data in a buffer', function() {
                instance.set('testProperty', 'testValue');

                expect(instance.__bufferedProperties__.testProperty).to.equal('testValue');
            });

            it('sets a one time handler for the content loaded event to save the buffered data', function() {
                instance.set('testProperty', 'testValue');

                ok(content.one.calledWith('isLoaded', instance, instance.tryAutoSave));
            });
        });

        context('when ready to save', function() {
            before(function() {
                instance.set('isSaving', false);
                sinon.stub(instance, 'tryAutoSave');
            });

            it('calls tryAutoSave', function() {
                instance.set('testProperty', 'testValue');

                ok(instance.tryAutoSave.calledOnce, 'should call tryAutoSave');
            });
        });
    });

    describe('#tryAutoSave', function() {
        before(function() {
            sinon.stub(instance, 'save');
            sinon.stub(content, 'setProperties');
            sinon.stub(Ember.run, 'debounce');
            instance.__bufferedProperties__.testProperty = 'testValue';
        });

        after(function() {
           Ember.run.debounce.restore();
        });

        it('calls setProperties on the proxied content with the buffered properties', function() {
            instance.tryAutoSave();

            ok(content.setProperties.calledWithMatch({ testProperty: 'testValue' }), 'should call setProperties with buffered properties');
        });

        it('debounces a call to save', function() {
            instance.tryAutoSave();

            ok(Ember.run.debounce.calledWith(instance, instance.save, instance.autoSaveWait), 'should debounce call to save');
        });

        it('clears the buffer', function() {
            instance.tryAutoSave();

            expect(instance.__bufferedProperties__).to.eql({});
        });
    });
});

