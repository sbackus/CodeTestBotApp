import { moduleFor, test } from 'ember-qunit';
import { injectFakeStore } from '../../../helpers/data';
import User from 'code-test-bot-app/models/user';

moduleFor('route:assessments/new', 'Assessments New Route');

test('model is new assessment record, languages and levels', function() {
    expect(4);

    var expectedAssessment = Ember.Object.create({});
    var expectedLanguages = 'expectedLanguages';
    var expectedLevels = 'expectedLevels';
    var expectedAssessor = 'expectedAssessor';

    var route = this.subject();
    var store = injectFakeStore(route);

    sinon.stub(store, 'createRecord').withArgs('assessment').returns(expectedAssessment);
    var find = sinon.stub(store, 'find');
    find.withArgs('language').returns(expectedLanguages);
    find.withArgs('level').returns(expectedLevels);

    var transition = { data: { assessor: expectedAssessor } };
    var model;
    Ember.run(function() {
        model = route.model(null, transition);
    });

    equal(model.get('assessment'), expectedAssessment);
    equal(model.get('languages'), expectedLanguages);
    equal(model.get('levels'), expectedLevels);
    equal(model.get('assessment.assessor'), expectedAssessor);
});
