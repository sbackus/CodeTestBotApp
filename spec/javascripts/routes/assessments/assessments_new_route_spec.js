//= require spec_helper

describe('AssessmentsNewRoute', function() {
    var route;

    beforeEach(function() {
        route = testing().route('assessments.new');
    });

    describe('model', function() {
        it('creates an empty assessment record', function() {
            var model = route.model();

            var assessment = model.get('assessment');
            expect(assessment instanceof CodeTestBotApp.Assessment).to.be.true;
            expect(assessment.get('score')).to.be.undefined;
            expect(assessment.get('notes')).to.be.undefined;
        });

        it('loads languages', function(done) {
            var languages = { languages: [{ id: 1, name: 'Java'}]};
            testing().mockAjaxResponse('GET', '/languages', languages);

            Ember.run(function() {
                var model = route.model();
                model.get('languages').then(function() {
                    expect(model.get('languages.length')).to.eq(1);
                    done();
                });
            });
        });

        it('loads levels', function(done) {
            var levels = { levels: [{id: 1, text: 'Junior'}] };
            testing().mockAjaxResponse('GET', '/levels', levels);

            Ember.run(function() {
                var model = route.model();
                model.get('levels').then(function() {
                    expect(model.get('levels.length')).to.eq(1);
                    done();
                });
            });
        });
    });

    describe('setupController', function() {
        var route, model, controller;
        var store;
        var submission;
        beforeEach(function(done) {
            testing().mockAjaxResponse('GET', '/sessions/current', { session: { id: 1, user_id: 2 }, users: [{id: 2, name: 'Test'}]});

            Ember.run(function() {
                store = testing().store();
                store.push('language', { id: 1, name: 'Java' });
                store.push('level', { id: 1, text: 'Junior' });

                model = Ember.Object.create({
                    assessment: Ember.Object.create(),
                    languages: [],
                    levels: []
                });

                route = testing().route('assessments.new');

                submission = Ember.Object.create({
                    id: 123,
                    language: store.find('language', 1),
                    candidate: Ember.Object.create({ id: 2, level: store.find('level', 1) })
                });
                sinon.stub(route, 'controllerFor').withArgs('submission').returns(Ember.Object.create({ model: submission }));
                controller = Ember.Object.create({});
                done();
            });
        });

        afterEach(function() {
            route.controllerFor.restore();
        });

        it('sets the submission on the assessment', function() {
            route.setupController(controller, model);

            expect(model.get('assessment.submission')).to.eq(submission);
        });

        it('sets the selected language and level on the controller', function() {
            route.setupController(controller, model);

            expect(controller.get('selectedLanguage')).to.deep.eq(store.find('language', 1));
            expect(controller.get('selectedLevel')).to.deep.eq(store.find('level', 1));
        });

        it('sets the assessment assessor to the current user', function(done) {
            expect(route.setupController(controller, model)).to.eventually.be.fulfilled.then(function(){
                var assessor = model.get('assessment.assessor');
                expect(assessor.get('id')).to.eq('3');
                expect(assessor.get('name')).to.eq('Test');
                done();
            });
        });
    });
});
