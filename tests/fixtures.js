/* globals CodeTestBotAppENV */

import Ember from 'ember';
import { defineFixture } from 'ic-ajax';

defineFixture(CodeTestBotAppENV.NEW_SESSION_URL + '?redirect_uri=' + CodeTestBotAppENV.APP_HOST + '/auth/complete', {
    response: {auth_uri: 'testing_uri'},
    jqXHR: {},
    textStatus: 'success'
});

defineServerFixture('/users', { 
    users: [
        { id: 1, name: 'User1', editable: true, role_id: 1 },
        { id: 2, name: 'User2', editable: false, role_id: 3 }
    ],
    roles: [
        { id: 1, name: 'Assessor' },
        { id: 3, name: 'Administrator' }
    ]
});
defineServerFixture('/users/1', { 
    user: { id: 1, name: 'User1', editable: true, role_id: 1 },
    roles: [{ id: 1, name: 'Assessor' }]
});
defineServerFixture('/users/2', { 
    user: { id: 2, name: 'User2', editable: false, role_id: 3 },
    roles: [{ id: 3, name: 'Administrator' }]
});

defineServerFixture('/roles/1', {
    role: { id: 1, name: 'Assessor' }
});
defineServerFixture('/roles/3', {
    role: { id: 3, name: 'Administrator' }
});

defineServerFixture('/languages', { languages: [
    { id: 1, name: 'Java' },
    { id: 2, name: 'Ruby' }
]});
defineServerFixture('/languages/1', { language: { id: 1, name: 'Java' } });
defineServerFixture('/languages/2', { language: { id: 2, name: 'Ruby' } });

defineServerFixture('/levels', { levels: [
    { id: 1, text: 'Junior' },
    { id: 2, text: 'Mid' },
    { id: 3, text: 'Senior' },
    { id: 4, text: 'Tech Lead' }
]});
defineServerFixture('/levels/1', { level: { id: 1, text: 'Junior' } });
defineServerFixture('/levels/2', { level: { id: 2, text: 'Mid' } });

defineServerFixture('/submissions', {
    submissions: [{id: 1}]
});
defineServerFixture('/submissions/1', {
    submission: {
        id: 1,
        candidate_email: 'Candidate1',
        level_id: 1,
        email_text: 'some text',
        zipfile: 'url to file',
        language_id: 1,
    },
    levels: [
        { id: 1, text: 'Junior' }
    ],
    languages: [
        { id: 1, name: 'Java' }
    ]
});

defineServerFixture('/assessors/2', {
    assessor: { id: 2, name: 'Assessor2' }
});
defineServerFixture('/assessors/3', {
    assessor: { id: 3, name: 'Assessor3' }
});

function defineServerFixture(path, response, options) {
    options = Ember.merge({ jqXHR: {}, textStatus: 'success' }, options);
    options.response = response;

    defineFixture(CodeTestBotAppENV.SERVER_HOST + path, options);
}

export {
    defineServerFixture
};

export default {};
