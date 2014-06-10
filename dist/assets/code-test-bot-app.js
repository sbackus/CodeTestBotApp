
;define("code-test-bot-app/adapters/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.ActiveModelAdapter.extend({
        host: CodeTestBotAppENV.SERVER_HOST
    });
  });
;define("code-test-bot-app/app", 
  ["ember/resolver","ember/load-initializers","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var loadInitializers = __dependency2__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
        modulePrefix: 'code-test-bot-app', // TODO: loaded via config
        Resolver: Resolver,
        ready: function() {
            $(document).foundation();
        }
    });

    loadInitializers(App, 'code-test-bot-app');

    __exports__["default"] = App;
  });
;define("code-test-bot-app/components/modal-dialog", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Component.extend({
        actions: {
            close: function() {
                this.sendAction();
            }
        }
    });
  });
;define("code-test-bot-app/controllers/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Controller.extend();
  });
;define("code-test-bot-app/controllers/assessment/edit", 
  ["code-test-bot-app/mixins/user-aware-controller","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var UserAwareControllerMixin = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend(UserAwareControllerMixin, {

        ownAssessment: function(){
            return this.get('user.id') === this.get('assessor.id');
        }.property('ownAssessment').volatile(),
        notOwnAssessment: Ember.computed.not('ownAssessment').volatile(),
        actions: {
            editAssessment: function() {
                var self = this;
                var assessment = this.get('content');
                assessment.save();
                return assessment.save().then(function() {
                   self.transitionToRoute('submission.index', assessment.get('submission'));
                });

            }
        }
    });
  });
;define("code-test-bot-app/mixins/user-aware-controller", 
  ["code-test-bot-app/mixins/user-aware","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var UserAwareMixin = __dependency1__["default"];

    __exports__["default"] = Ember.Mixin.create(UserAwareMixin, {
        needs: ['application'],
        user: Ember.computed.alias('controllers.application.user')
    });
  });
;define("code-test-bot-app/mixins/user-aware", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = Ember.Mixin.create({
        user: null,

        isRecruiter: function() {
            return this.hasRole('Recruiter') || this.hasRole('Administrator');
        }.property('user.role.name'),

        isAdmin: function() {
            return this.hasRole('Administrator');
        }.property('user.role.name'),

        hasRole: function(roleName) {
            return this.get('user.role.name') === roleName;
        }
    });
  });
;define("code-test-bot-app/controllers/assessment/index", 
  ["code-test-bot-app/mixins/user-aware-controller","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var UserAwareControllerMixin = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend(UserAwareControllerMixin, {
        ownAssessment: function(){
            return this.get('user.id') === this.get('assessor.id');
        }.property('ownAssessment').volatile(),
        assessmentCreatedRecently: function(){
            var createdAt = this.get('createdAtMoment');
            var expiryTime = createdAt.add('hours', 1);
            var now = moment();
            return moment(now).isBefore(expiryTime);
        }.property('assessmentCreatedRecently').volatile(),
        isInactive: Ember.computed.not('assessmentCreatedRecently').volatile(),
        canEdit: Ember.computed.and('ownAssessment', 'assessmentCreatedRecently').volatile()
    });
  });
;define("code-test-bot-app/controllers/assessments/new", 
  ["code-test-bot-app/mixins/auto-saveable","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AutoSaveable = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend(AutoSaveable, {
        selectedLanguage: null,
        selectedLevel: null,

        isFormIncomplete: function() {
            return Ember.isEmpty(this.get('score')) || Ember.isEmpty(this.get('notes'));
        }.property('score', 'notes'),

        save: function() {
            this.get('content').save();
        },

        actions: {
            createAssessment: function() {
                var self = this;
                var assessment = this.get('content');
                assessment.set('published', true);
                return assessment.save().then(function() {
                    self.transitionToRoute('submission.index', assessment.get('submission'));
                });
            }
        }
    });
  });
;define("code-test-bot-app/mixins/auto-saveable", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = Ember.Mixin.create({
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
  });
;define("code-test-bot-app/controllers/auth/login", 
  ["code-test-bot-app/lib/window-location-helper","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var WindowLocationHelper = __dependency1__["default"];

    var AuthLoginController = Ember.ObjectController.extend({
        actions: {
            login: function() {
                WindowLocationHelper.setLocation(this.get('model.auth_uri'));
            }
        }
    });

    __exports__["default"] = AuthLoginController;
  });
;define("code-test-bot-app/lib/window-location-helper", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = (function() {
        var helper = Ember.Object.extend();
        helper.reopenClass({
            setLocation: function(location) {
                window.location = location;
            }
        });

        return helper;
    })();
  });
;define("code-test-bot-app/controllers/error", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Controller.extend();
  });
;define("code-test-bot-app/controllers/menu", 
  ["code-test-bot-app/mixins/user-aware-controller","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var UserAwareControllerMixin = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend(UserAwareControllerMixin);
  });
;define("code-test-bot-app/controllers/secured/edit", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = Ember.ObjectController.extend({
        actions: {
            save: function() {
                var self = this;
                self.get('content').save().then(function() {
                    self.transitionToRoute('/');
                });
            }
        }
    });
  });
;define("code-test-bot-app/controllers/submission/confirm-delete", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = Ember.ObjectController.extend({
        actions: {
            deleteSubmission: function() {
                var submission = this.get('content');
                submission.deleteRecord();
                submission.save();
                this.send('closeModal');
            }
        }
    });
  });
;define("code-test-bot-app/controllers/submission/index", 
  ["code-test-bot-app/mixins/user-aware-controller","code-test-bot-app/utils/math","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var UserAwareControllerMixin = __dependency1__["default"];
    var cumulativeMovingAverage = __dependency2__.cumulativeMovingAverage;
    var roundToNearestHalf = __dependency2__.roundToNearestHalf;

    __exports__["default"] = Ember.ObjectController.extend(UserAwareControllerMixin, {
        userHasPublishedAssessment: false,

        assessments: function() {
            var id = this.get('id');
            return this.store.filter('assessment', { submission_id: id, include_unpublished: true }, function(assessment) {
                return assessment.get('submission.id') === id;
            });
        }.property('id'),

        publishedAssessments: Ember.computed.filterBy('assessments', 'published', true),
        unpublishedAssessments: Ember.computed.filterBy('assessments', 'published', false),

        rawAverageScore: Ember.reduceComputed('publishedAssessments', {
            initialValue: 0,
            initialize: function(initialValue, changeMeta, instanceMeta) {
                instanceMeta.count = 0;
            },
            addedItem: function(accumulatedValue, item, changeMeta, instanceMeta) {
                var score = item.get('score');
                var avg = cumulativeMovingAverage(accumulatedValue, score, instanceMeta.count);
                instanceMeta.count++;
                return avg;
            },
            removedItem: function(accumulatedValue, item, changeMeta, instanceMeta) {
                var score = item.get('score');
                var avg = cumulativeMovingAverage(accumulatedValue, score, instanceMeta.count, true);
                instanceMeta.count--;
                return avg;
            }
        }),

        averageScore: function() {
            return roundToNearestHalf(this.get('rawAverageScore'));
        }.property('rawAverageScore'),

        hasPublishedAssessments: function() {
            return this.get('publishedAssessments.length') > 0;
        }.property('publishedAssessments.length'),

        isInactive: Ember.computed.not('active'),
        showCloseButton: Ember.computed.and('isRecruiter', 'active'),
        showReportButton: Ember.computed.and('isRecruiter', 'hasPublishedAssessments'),
        showAssessments: Ember.computed.or('userHasPublishedAssessment', 'isRecruiter'),
        userCanCreateAssessment: Ember.computed.not('userHasPublishedAssessment'),

        updateUserHasAssessment: function() {
            var assessments = this.get('publishedAssessments');
            this.set('userHasPublishedAssessment', assessments.findBy('assessor.id', this.get('user.id')) !== undefined);
        }.observes('publishedAssessments.[]'),

        newAssessmentButtonText: function() {
            var userId = this.get('user.id');
            var assessments = this.get('unpublishedAssessments');
                if (assessments.findBy('assessor.id', userId) !== undefined) {
                    return 'Resume Assessment';
                } else {
                    return 'New Assessment';
                }
        }.property('assessments.[]'),

        actions: {
            closeSubmission: function() {
                var self = this;
                var submission = this.get('content');
                submission.set('active', false);
                submission.set('averageScore', this.get('averageScore'));
                submission.save().then(function() {
                    self.transitionToRoute('/submissions');
                });
            }
        }
    });
  });
;define("code-test-bot-app/utils/math", 
  ["exports"],
  function(__exports__) {
    "use strict";

    function cumulativeMovingAverage(accumulatedValue, value, count, removing) {
        var multiple = removing ? -1 : 1;
        return ((multiple * value) + count * accumulatedValue) / (count + multiple);
    }

    function roundToNearestHalf(value) {
        return Math.round(value * 2) / 2;
    }

    __exports__.cumulativeMovingAverage = cumulativeMovingAverage;
    __exports__.roundToNearestHalf = roundToNearestHalf;
    __exports__["default"] = { cumulativeMovingAverage: cumulativeMovingAverage, roundToNearestHalf: roundToNearestHalf };
  });
;define("code-test-bot-app/controllers/submission/report", 
  ["code-test-bot-app/utils/math","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* globals marked */

    var cumulativeMovingAverage = __dependency1__.cumulativeMovingAverage;
    var roundToNearestHalf = __dependency1__.roundToNearestHalf;

    __exports__["default"] = Ember.ObjectController.extend({
        // TODO: this is duplicated with submission/index.js
        assessments: function() {
            var id = this.get('id');
            return this.store.filter('assessment', { submission_id: id }, function(assessment) {
                return assessment.get('submission.id') === id;
            });
        }.property('id'),

        publishedAssessments: Ember.computed.filterBy('assessments', 'published', true),

        rawAverageScore: Ember.reduceComputed('publishedAssessments', {
            initialValue: 0,
            initialize: function(initialValue, changeMeta, instanceMeta) {
                instanceMeta.count = 0;
            },
            addedItem: function(accumulatedValue, item, changeMeta, instanceMeta) {
                var score = item.get('score');
                var avg = cumulativeMovingAverage(accumulatedValue, score, instanceMeta.count);
                instanceMeta.count++;
                return avg;
            },
            removedItem: function(accumulatedValue, item, changeMeta, instanceMeta) {
                var score = item.get('score');
                var avg = cumulativeMovingAverage(accumulatedValue, score, instanceMeta.count, true);
                instanceMeta.count--;
                return avg;
            }
        }),

        averageScore: function() {
            return roundToNearestHalf(this.get('rawAverageScore'));
        }.property('rawAverageScore'),

        assessors: '',
        report: '',

        updateAssessors: function() {
            var assessments = this.get('publishedAssessments');
            var assessors = assessments.map(function(assessment) {
                return assessment.get('assessor.name') + ' (score: ' + assessment.get('score') + ')';
            });
            this.set('assessors', assessors.join(', '));
        }.observes('publishedAssessments.[]'),

        updateReport: function() {
            var assessments = this.get('publishedAssessments');
            var report = assessments.reduce(function(previousValue, item, index) {
                if (previousValue !== '') {
                    previousValue += '\n\n';
                }

                return previousValue + '##### Developer ' + (index + 1) + ' wrote:\n\n' + item.get('notes');
            }, '');

            var renderer = new marked.Renderer();
            report = marked(report, { renderer: renderer });

            this.set('report', report);
        }.observes('publishedAssessments.[]')
    });
  });
;define("code-test-bot-app/controllers/submissions/index", 
  ["code-test-bot-app/mixins/user-aware-controller","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var UserAwareControllerMixin = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend(UserAwareControllerMixin, {
        sortPropertiesActive: ['createdAtDisplay:desc'],
        sortPropertiesInactive: ['updatedAtDisplay:desc'],
        sortAscending: false,

        sortedActiveSubmissions: Ember.computed.sort('model', 'sortPropertiesActive'),
        activeSubmissions: Ember.computed.filterBy('sortedActiveSubmissions', 'active', true),
        sortedInactiveSubmissions: Ember.computed.sort('model', 'sortPropertiesInactive'),
        inactiveSubmissions: Ember.computed.filterBy('sortedInactiveSubmissions', 'active', false),

        actions: {
            confirmDelete: function(submission){
               return this.send('openModal', 'submission/confirm-delete', submission);
            },

            activeSortBy: function (sortPropertiesActive) {
                this.set('sortPropertiesActive', [sortPropertiesActive]);
            },

            inactiveSortBy: function (sortPropertiesInactive) {
                this.set('sortPropertiesInactive', [sortPropertiesInactive]);
            }
        }
    });
  });
;define("code-test-bot-app/controllers/submissions/new", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.ObjectController.extend({
        candidateName: null,
        candidateEmail: null,
        selectedLanguage: null,
        selectedLevel: null,

        isFormIncomplete: Ember.computed.or('isCandidateIncomplete', 'isSubmissionIncomplete'),

        isCandidateIncomplete: function() {
            return Ember.isEmpty(this.get('candidateName')) ||
                Ember.isEmpty(this.get('candidateEmail'));
        }.property('candidateName', 'candidateEmail'),

        isSubmissionIncomplete: function() {
            return Ember.isEmpty(this.get('submission.emailText')) ||
                Ember.isEmpty(this.get('submission.zipfile'));
        }.property('submission.emailText', 'submission.zipfile'),

        findCandidate: function() {
            return this.store.find('candidate', { email: this.get('candidateEmail') }).then(function(results) {
                return results.get('firstObject');
            });
        },

        createSubmission: function() {
            var submission = this.get('submission');
            submission.set('candidateName', this.get('candidateName'));
            submission.set('candidateEmail', this.get('candidateEmail'));
            submission.set('level', this.get('selectedLevel'));
            submission.set('language', this.get('selectedLanguage'));
            return submission.save();
        },

        actions: {
            submit: function() {
                var self = this;
                self.createSubmission() .then(function() {
                    self.transitionToRoute('/submissions');
                });
            }
        }
    });
  });
;define("code-test-bot-app/controllers/user", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.ObjectController.extend({
        editDisabled: Ember.computed.not('editable')
    });
  });
;define("code-test-bot-app/controllers/user/edit", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.ObjectController.extend({
       
           all_roles: function() {
               return this.store.find('role');
           }.property('model.all_roles'),
        actions: {
               changeRole: function() {
                   var role = this.get('selectedRole');
                   var user = this.get('content');
                   user.set('role', role);
                   user.save();
               }
        }
    });
  });
;define("code-test-bot-app/controllers/users/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.ArrayController.extend({
        itemController: 'user'
    });
  });
;define("code-test-bot-app/helpers/render-marked", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* globals marked */

    __exports__["default"] = Ember.Handlebars.makeBoundHelper(function(raw) {
        var renderer = new marked.Renderer();
        return new Ember.Handlebars.SafeString(marked(raw, { renderer: renderer }));
    });
  });
;define("code-test-bot-app/initializers/authentication", 
  ["code-test-bot-app/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator","exports"],
  function(__dependency1__, __exports__) {
    "use strict";

    __exports__["default"] = {
        name: 'authentication',
        initialize: function(container, application) {
            container.register('authenticator:out-of-band-token', Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator);

            var options = {
                authorizerFactory: 'authorizer:oauth2-bearer',
                authenticationRoute: 'auth.login',
                routeAfterAuthentication: 'secured.index',
                crossOriginWhitelist: [CodeTestBotAppENV.SERVER_HOST]
            };

            options = Ember.merge({ storeFactory: application.get('storeFactory') }, options);

            Ember.SimpleAuth.setup(container, application, options);
        }
    };
  });
;define("code-test-bot-app/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator", 
  ["exports"],
  function(__exports__) {
    "use strict";
    Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
        restore: function(data) {
            return new Ember.RSVP.Promise(function(resolve, reject) {
                if (!Ember.isEmpty(data.access_token)) {
                    var now = (new Date()).getTime();
                    if (!Ember.isEmpty(data.expires_at) && data.expires_at < now) {
                        reject();
                    } else {
                        resolve(data);
                    }
                } else {
                    reject();
                }
            });
        },

        authenticate: function(token_data) {
            return new Ember.RSVP.Promise(function(resolve) {
                Ember.run(function() {
                    token_data.expires_at = parseInt(token_data.expires_at) * 1000;
                    token_data.expires = token_data.expires === 'true';
                    resolve(token_data);
                });
            });
        },

        invalidate: function() {
            // TODO: delete from server
            return new Ember.RSVP.resolve();
        }
    });

    __exports__["default"] = Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator;
  });
;define("code-test-bot-app/initializers/stores", 
  ["code-test-bot-app/lib/stores/local","code-test-bot-app/lib/stores/ephemeral","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var LocalStore = __dependency1__["default"];
    var EphemeralStore = __dependency2__["default"];

    __exports__["default"] = {
        name: 'stores',
        initialize: function(container, application) {
            container.register('data-store:local', LocalStore);
            container.register('data-store:ephemeral', EphemeralStore);

            var dataStore = application.get('dataStore');
            if (Ember.isEmpty(dataStore)) {
                dataStore = 'data-store:local';
            }

            if (typeof dataStore === 'string') {
                application.set('dataStore', container.lookup(dataStore));
            }
        }
    };
  });
;define("code-test-bot-app/lib/stores/local", 
  ["code-test-bot-app/lib/stores/base","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* globals localStorage */

    var Base = __dependency1__["default"];

    __exports__["default"] = Base.extend({
        getItem: function(key) {
            return localStorage.getItem(key);
        },

        setItem: function(key, value) {
            localStorage.setItem(key, value);
        },

        removeItem: function(key) {
            localStorage.removeItem(key);
        }
    });
  });
;define("code-test-bot-app/lib/stores/base", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Object.extend({
        getItem: function() {
            return null;
        },

        setItem: function() {
        },

        removeItem: function() {
        }
    });
  });
;define("code-test-bot-app/lib/stores/ephemeral", 
  ["code-test-bot-app/lib/stores/base","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Base = __dependency1__["default"];

    __exports__["default"] = Base.extend({
        data: {},

        getItem: function(key) {
            return this.data[key];
        },

        setItem: function(key, value) {
            this.data[key] = value;
        },

        removeItem: function(key) {
            delete this.data[key];
        }
    });
  });
;define("code-test-bot-app/lib/auth/www-authenticate-header", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var split = String.prototype.split;

    var WWWAuthenticateHeader = Ember.Object.extend({
        rawHeader: null,
        error: null,


        init: function() {
            var self = this;
            var parts = split.call(this.get('rawHeader'), ' ');
            parts.shift();
            parts.forEach(function(pair) {
                pair = split.call(pair, '=');
                if (pair[0] === 'error') {
                    self.set('error', pair[1].replace(',', ''));
                }
            });
        },

        isEmpty: function() {
            return Ember.isEmpty(this.get('error'));
        }.property('error'),

        isInvalidToken: function() {
            return this.get('error') === '"invalid_token"';
        }.property('error')
    });

    WWWAuthenticateHeader.reopenClass({
        parse: function(xhr) {
            return WWWAuthenticateHeader.create({ rawHeader: xhr.getResponseHeader('WWW-Authenticate') });
        }
    });

    __exports__["default"] = WWWAuthenticateHeader;
  });
;define("code-test-bot-app/mixins/user-aware-route", 
  ["code-test-bot-app/mixins/user-aware","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var UserAwareMixin = __dependency1__["default"];

    __exports__["default"] = Ember.Mixin.create(UserAwareMixin, {
        user: Ember.computed.alias('applicationController.user'),

        applicationController: function() {
            return this.controllerFor('application');
        }.property()
    });
  });
;define("code-test-bot-app/models/assessment", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* globals marked */

    __exports__["default"] = DS.Model.extend({
        score: DS.attr(),
        notes: DS.attr(),
        published: DS.attr(),
        createdAt: DS.attr(),
        updatedAt: DS.attr(),
        submission: DS.belongsTo('submission'),
        assessor: DS.belongsTo('assessor'),

        createdAtDisplay: function() {
            return this.get('createdAtMoment').format('l LT');
        }.property('createdAtMoment'),

        createdAtMoment: function() {
            return moment(this.get('createdAt'));
        }.property('createdAt'),

        updatedAtDisplay: function() {
            return moment(this.get('updatedAt')).format('l LT');
        }.property('updatedAt'),
        
        notesDisplay: function() {
            var renderer = new marked.Renderer();
            return marked(this.get('notes'), { renderer: renderer });
        }.property('notes')
    });
  });
;define("code-test-bot-app/models/assessor", 
  ["code-test-bot-app/models/user","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var User = __dependency1__["default"];

    __exports__["default"] = User.extend({
        "toString": function() {
            return this.get('name') + ' <' + this.get('email') + '>';
        }
    });
  });
;define("code-test-bot-app/models/user", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        name: DS.attr(),
        email: DS.attr(),
        imageUrl: DS.attr(),
        editable: DS.attr(),
        role: DS.belongsTo('role'),
        session: DS.hasMany('session')
    });
  });
;define("code-test-bot-app/models/language", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        name: DS.attr('string'),

        submissions: DS.hasMany('submission')
    });
  });
;define("code-test-bot-app/models/level", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        text: DS.attr('string'),
        submissions: DS.hasMany('submission')
    });
  });
;define("code-test-bot-app/models/page", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = DS.Model.extend({
        name: DS.attr(),
        rawText: DS.attr()
    });
  });
;define("code-test-bot-app/models/role", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        name: DS.attr(),
        users: DS.hasMany('user')
    });
  });
;define("code-test-bot-app/models/session", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        token: DS.attr(),
        tokenExpiry: DS.attr(),
        user: DS.belongsTo('user')
    });
  });
;define("code-test-bot-app/models/submission", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        candidateName: DS.attr(),
        candidateEmail: DS.attr(),
        emailText: DS.attr(),
        zipfile: DS.attr(),
        fileName: DS.attr(),
        active: DS.attr(),
        createdAt: DS.attr(),
        updatedAt: DS.attr(),
        averageScore: DS.attr(),

        level: DS.belongsTo('level'),
        language: DS.belongsTo('language'),
        assessments: DS.hasMany('assessment'),

        candidateDisplay: function() {
            return this.get('candidateName') + ' <' + this.get('candidateEmail') + '>';
        }.property('candidateName', 'candidateEmail'),

        languageDisplay: function() {
            return Ember.isNone(this.get('language')) ? 'Unknown' : this.get('language.name');
        }.property('language'),

        createdAtDisplay: function() {
            return moment(this.get('createdAt')).format('l LT');
        }.property('createdAt'),
        updatedAtDisplay: function() {
            return moment(this.get('updatedAt')).format('l LT');
        }.property('updatedAt')

    });
  });
;define("code-test-bot-app/router", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var Router = Ember.Router.extend({
      location: 'auto'
    });

    Router.map(function() {
        this.resource('auth', function() {
            this.route('login');
            this.route('logout');
            this.route('complete');
        });

        this.resource('secured', { path: '/' }, function() {
            this.route('edit');

            this.resource('submissions', function() {
                this.route('new');

                this.resource('submission', { path: '/:submission_id' }, function() {
                    this.route('report');

                    this.resource('assessments', function() {
                        this.route('new');
                    });
                });
            });

            this.resource('assessments', function() {
                this.resource('assessment', { path: '/:assessment_id' }, function() {
                    this.route('edit');
                });
            });
            
            this.resource('admin', function() {
                this.resource('users', function() {
                    this.resource('user', { path: '/:user_id' }, function() {
                        this.route('edit');
                    });
                });
            });
        });
    });

    __exports__["default"] = Router;
  });
;define("code-test-bot-app/routes/admin", 
  ["code-test-bot-app/mixins/user-aware-route","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var UserAwareRouteMixin = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend(UserAwareRouteMixin, {
        setupController: function(controller, model) {
            if (!this.get('isAdmin')) {
                throw 'You must be an administrator to access this area.';
            }

            this._super(controller, model);
        }
    });
  });
;define("code-test-bot-app/routes/application", 
  ["code-test-bot-app/lib/auth/www-authenticate-header","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var WWWAuthenticateHeader = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
        handleUnauthorized: function(xhr) {
            var header = WWWAuthenticateHeader.parse(xhr);
            if (header.get('isEmpty') || header.get('isInvalidToken')) {
                this.transitionTo('auth.login');
            }
        },

        renderTemplate: function(controller, model) {
            this._super(controller, model);
            this.renderMenu();
        },

        renderMenu: function() {
            this.render('menu', {
                into: 'application',
                outlet: 'menu',
                controller: 'menu'
            });
        },

        actions: {
            error: function(err) {
                var errorMessage = 'An unknown error occurred.';

                if (typeof err === 'string') {
                    errorMessage = err;
                }

                var xhr = err.jqXHR ? err.jqXHR : err;
                if (xhr.status === 401) {
                    this.handleUnauthorized(xhr);
                } else if (xhr.status === 403) {
                    errorMessage = 'You do not have permission to access this page.';
                }

                this.controllerFor('error').set('error', errorMessage);
                if (!this.router._activeViews["hasOwnProperty"]('application')) {
                    this.render('application');
                    this.renderMenu();
                }

                this.render('error', {
                    into: 'application'
                });

                return false;
            },
            unauthorized: function(jqXHR) {
                this.handleUnauthorized(jqXHR);
            },

            openModal: function(modalName, model) {
                this.controllerFor(modalName).set('model', model);
                return this.render(modalName, {
                    into: 'application',
                    outlet: 'modal',
                });
            },

            closeModal: function() {
                return this.disconnectOutlet({
                    outlet: 'modal',
                    parentView: 'application'
                });
            }
        }
    });
  });
;define("code-test-bot-app/routes/assessments/new", 
  ["code-test-bot-app/mixins/user-aware-route","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var UserAwareRouteMixin = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend(UserAwareRouteMixin, {
        model: function() {
            var self = this;
            var submission = self.modelFor('submission');
            var assessor = this.modelFor('secured').get('user');
            return self.store.find('assessment', { submission_id: submission.get('id'), assessor_id: assessor.get('id'), include_unpublished: true }).then(function(assessments) {
                if (assessments.get('length') === 0) {
                    var model = self.store.createRecord('assessment');
                    model.set('published', false);
                    model.set('languages', self.store.find('language'));
                    model.set('levels', self.store.find('level'));
                    model.set('assessor', self.store.push('assessor', assessor.toJSON({ includeId: true })));
                    return model;
                } else {
                    return assessments.get('firstObject');
                }
            });
        },

        setupController: function(controller, model) {
            this._super(controller, model);

            var submission = this.controllerFor('submission').get('model');
            model.set('submission', submission);
            controller.set('selectedLanguage', submission.get('language'));
            controller.set('selectedLevel', submission.get('level'));
        }
    });
  });
;define("code-test-bot-app/routes/auth/complete", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
        beforeModel: function(transition) {
            var params = transition.queryParams;
            var token_data = {
                access_token: params.token,
                expires_at: params.expires_at,
                expires: params.expires
            };

            var self = this;
            transition.then(function() {
                return self.get('session').authenticate('authenticator:out-of-band-token', token_data).then(function() {
                    var attemptedTransition = CodeTestBotApp.get('dataStore').getItem('attemptedTransition') || '/';
                    CodeTestBotApp.get('dataStore').removeItem('attemptedTransition');

                    return self.transitionTo(attemptedTransition);
                });
            });
        }
    });
  });
;define("code-test-bot-app/routes/auth/login", 
  ["ic-ajax","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var request = __dependency1__.request;

    __exports__["default"] = Ember.Route.extend({
        model: function() {
            return request(CodeTestBotAppENV.NEW_SESSION_URL + '?redirect_uri=' + CodeTestBotAppENV.APP_HOST + '/auth/complete');
        }
    });
  });
;define("code-test-bot-app/routes/secured", 
  ["code-test-bot-app/routes/application","code-test-bot-app/mixins/user-aware","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var ApplicationRoute = __dependency1__["default"];
    var UserAwareMixin = __dependency2__["default"];

    __exports__["default"] = ApplicationRoute.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, UserAwareMixin, {
        beforeModel: function(transition) {
            var session = this.get('session');
            if (!session.get('isAuthenticated')) {
                window.CodeTestBotApp.get('dataStore').setItem('attemptedTransition', transition.intent.url);
                return this._super(transition);
            }
        },

        model: function() {
            var self = this;
            return self.store.find('session', 'current').then(function(session) {
                self.set('user', session.get('user'));
                return Ember.Object.create({
                    user: self.get('user')
                });
            });
        },

        setupController: function(controller, model) {
            this._super(controller, model);
            this.controllerFor('application').set('user', this.get('user'));
        },

        actions: {
            authenticate: function(params) {
                var token_data = {
                    access_token: params.token,
                    expires_at: params.expires_at,
                    expires: params.expires
                };

                return this.get('session').authenticate('authenticator:out-of-band-token', token_data);
            }
        }
    });
  });
;define("code-test-bot-app/routes/secured/edit", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = Ember.Route.extend({
        model: function() {
            return this.store.find('page', 'welcome');
        }
    });
  });
;define("code-test-bot-app/routes/secured/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
        model: function() {
            return this.store.find('page', 'welcome');
        }
    });
  });
;define("code-test-bot-app/routes/submissions/index", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = Ember.Route.extend({
        model: function() {
            return this.store.find('submission');
        }
    });
  });
;define("code-test-bot-app/routes/submissions/new", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
        model: function() {
            return Ember.Object.create({
                submission: this.store.createRecord('submission'),
                languages: this.store.find('language'),
                levels: this.store.find('level')
            });
        },

        actions: {
            willTransition: function() {
                var submission = this.controller.get('submission');
                if (submission.get('isNew')) {
                    submission.deleteRecord();
                }
            }
        }
    });
  });
;define("code-test-bot-app/routes/users/index", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = Ember.Route.extend({
        model: function() {
            return this.store.find('user');
        }
    });
  });
;define("code-test-bot-app/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "menu", options) : helperMissing.call(depth0, "outlet", "menu", options))));
      data.buffer.push("\n    ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <section class=\"top-bar-section\">\n        <ul class=\"right\">\n                <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "auth.login", options) : helperMissing.call(depth0, "link-to", "auth.login", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        </ul>\n    </section>\n    ");
      return buffer;
      }
    function program4(depth0,data) {
      
      
      data.buffer.push("<i class=\"fa fa-sign-in\"></i> Login");
      }

      data.buffer.push("<nav class=\"top-bar\" data-topbar>\n    <ul class=\"title-area\">\n        <li class=\"name\">\n            <h1><a href=\"/\">Code Test Bot</a></h1>\n        </li>\n        <li class=\"toggle-topbar menu-icon\"><a href=\"#\">Menu</a></li>\n    </ul>\n    ");
      stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</nav>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "modal", options) : helperMissing.call(depth0, "outlet", "modal", options))));
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/assessment/edit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      
      data.buffer.push(" <p>You can't edit this assessment as you didn't create it.</p> ");
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        <fieldset>\n            <legend>Assessment</legend>\n\n            <div class=\"row\">\n                <div class=\"large-2 columns\">\n                    <label>Score (0-5)\n                        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("score"),
        'class': ("score")
      },hashTypes:{'value': "ID",'class': "STRING"},hashContexts:{'value': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n                    </label>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"large-12 columns\">\n                    <label>Notes\n                        ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("notes"),
        'rows': ("6"),
        'class': ("notes")
      },hashTypes:{'value': "ID",'rows': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'rows': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n                    </label>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"large-12 columns\">\n                    <button class=\"button small radius success right create\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'disabled': ("isFormIncomplete")
      },hashTypes:{'disabled': "ID"},hashContexts:{'disabled': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "editAssessment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push(">Submit</button>\n                </div>\n            </div>\n        </fieldset>\n    ");
      return buffer;
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("Back to submission");
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Edit Assessment</h1>\n\n    ");
      stack1 = helpers['if'].call(depth0, "notOwnAssessment", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      stack1 = helpers['if'].call(depth0, "ownAssessment", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button small radius")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "submission.index", "submission", options) : helperMissing.call(depth0, "link-to", "submission.index", "submission", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n</div>");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/assessment/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button small radius")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "assessment.edit", "", options) : helperMissing.call(depth0, "link-to", "assessment.edit", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      return buffer;
      }
    function program2(depth0,data) {
      
      
      data.buffer.push("Edit");
      }

    function program4(depth0,data) {
      
      
      data.buffer.push("Back to submission");
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Assessment</h1>\n\n        <label>Assessor</label>\n        <p>");
      stack1 = helpers._triageMustache.call(depth0, "assessor.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n\n        <label>Score</label>\n        <p>");
      stack1 = helpers._triageMustache.call(depth0, "score", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n\n        <label>Notes</label>\n        <p>");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "notesDisplay", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("</p>\n\n        <label>Created at</label>\n        <p>");
      stack1 = helpers._triageMustache.call(depth0, "createdAtDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n\n        ");
      stack1 = helpers['if'].call(depth0, "canEdit", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button small radius")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "submission.index", "submission", options) : helperMissing.call(depth0, "link-to", "submission.index", "submission", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/assessments/new", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>New Assessment</h1>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <fieldset>\n            <legend>Submission</legend>\n\n\n            <div class=\"row\">\n                <div class=\"large-6 columns\">\n                    <label>Language\n                        ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
        'viewName': ("select"),
        'contentBinding': ("model.languages"),
        'optionLabelPath': ("content.name"),
        'optionValuePath': ("content.id"),
        'prompt': ("Select a language:"),
        'selectionBinding': ("selectedLanguage"),
        'disabled': ("disabled"),
        'class': ("language")
      },hashTypes:{'viewName': "STRING",'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'prompt': "STRING",'selectionBinding': "STRING",'disabled': "STRING",'class': "STRING"},hashContexts:{'viewName': depth0,'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'prompt': depth0,'selectionBinding': depth0,'disabled': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n                    </label>\n                </div>\n                <div class=\"large-6 columns\">\n                    <label>Candidate Level\n                        ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
        'viewName': ("select"),
        'contentBinding': ("model.levels"),
        'optionLabelPath': ("content.text"),
        'optionValuePath': ("content.id"),
        'prompt': ("Select a language:"),
        'selectionBinding': ("selectedLevel"),
        'disabled': ("disabled"),
        'class': ("level")
      },hashTypes:{'viewName': "STRING",'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'prompt': "STRING",'selectionBinding': "STRING",'disabled': "STRING",'class': "STRING"},hashContexts:{'viewName': depth0,'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'prompt': depth0,'selectionBinding': depth0,'disabled': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n                    </label>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"large-2 columns\">\n                    <label>File\n                        <a class=\"button small radius success zipfile\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'href': ("submission.zipfile")
      },hashTypes:{'href': "ID"},hashContexts:{'href': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("><i class=\"fi-download\"></i>&nbsp;Download</a>\n                    </label>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"large-12 columns\">\n                    <label>Email Text\n                        ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("submission.emailText"),
        'rows': ("6"),
        'disabled': ("disabled"),
        'class': ("email-text")
      },hashTypes:{'value': "ID",'rows': "STRING",'disabled': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'rows': depth0,'disabled': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n                    </label>\n                </div>\n            </div>\n        </fieldset>\n\n        <fieldset>\n            <legend>Assessment</legend>\n\n            <div class=\"row\">\n                <div class=\"large-2 columns\">\n                    <label>Score (0-5)\n                        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("score"),
        'class': ("score")
      },hashTypes:{'value': "ID",'class': "STRING"},hashContexts:{'value': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n                    </label>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"large-12 columns\">\n                    <label>Notes\n                        ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("notes"),
        'rows': ("6"),
        'class': ("notes")
      },hashTypes:{'value': "ID",'rows': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'rows': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n                    </label>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"large-2 large-offset-8 columns\">\n                    ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "saving-indicator", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push("\n                </div>\n                <div class=\"large-2 columns\">\n                    <button class=\"button small expand radius success create\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'disabled': ("isFormIncomplete")
      },hashTypes:{'disabled': "ID"},hashContexts:{'disabled': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "createAssessment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push(">Submit</button>\n                </div>\n            </div>\n        </fieldset>\n    </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/auth/login", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Session Expired</h1>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <p>You must login to continue.</p>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <button id='login'\n        ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "login", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class=\"button small\">Login with Google Apps</button>\n    </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/components/modal-dialog", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"reveal-modal-bg\" style=\"display:block;\"></div>\n<div class=\"reveal-modal open\" style=\"display:block; visibility: visible; opacity: 1;\">\n");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<a class=\"close-reveal-modal\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">&#215;</a>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/error", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Error</h1>\n        <div class=\"alert-box alert\">");
      stack1 = helpers._triageMustache.call(depth0, "error", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n    </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/menu", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      
      data.buffer.push("Submissions");
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <li class=\"has-dropdown\">\n        <a>Admin</a>\n        <ul class=\"dropdown\">\n          <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "users.index", options) : helperMissing.call(depth0, "link-to", "users.index", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        </ul>\n    </lI>\n    <li class=\"divider\"></li>\n    ");
      return buffer;
      }
    function program4(depth0,data) {
      
      
      data.buffer.push("<i class=\"fa fa-user\"></i> Users");
      }

      data.buffer.push("<section class=\"top-bar-section\">\n<ul class=\"right\">\n    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "submissions.index", options) : helperMissing.call(depth0, "link-to", "submissions.index", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    <li class=\"divider\"></li>\n    ");
      stack1 = helpers['if'].call(depth0, "isAdmin", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    <li class=\"has-dropdown profile-dropdown\">\n        <a>");
      stack1 = helpers._triageMustache.call(depth0, "user.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <img ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'src': ("user.imageUrl")
      },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" /></a>\n        <ul class=\"dropdown\">\n            <li><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "invalidateSession", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push("><i class=\"fa fa-sign-out\"></i> Logout</a></li>\n        </ul>\n    </li>\n</ul>\n</section>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/saving-indicator", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<p class=\"inline-with-button text-right\"><i class=\"fa fa-spin fa-spinner\"></i> ");
      stack1 = helpers._triageMustache.call(depth0, "view.message", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/secured/edit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Edit Page</h1>\n\n        <ul class=\"tabs\" data-tab>\n            <li class=\"tab-title active\"><a href=\"#edit\">Edit</a></li>\n            <li class=\"tab-title\"><a href=\"#preview\">Preview</a></li>\n        </ul>\n        <div class=\"tabs-content\">\n            <div class=\"content active\" id=\"edit\">\n                ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("rawText"),
        'cols': ("80"),
        'rows': ("20")
      },hashTypes:{'value': "ID",'cols': "STRING",'rows': "STRING"},hashContexts:{'value': depth0,'cols': depth0,'rows': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n            </div>\n            <div class=\"content\" id=\"preview\">\n                ");
      data.buffer.push(escapeExpression((helper = helpers['render-marked'] || (depth0 && depth0['render-marked']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "rawText", options) : helperMissing.call(depth0, "render-marked", "rawText", options))));
      data.buffer.push("\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-2 large-offset-10 columns\">\n        <button class=\"button expand success radius small\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Save Changes</button>\n    </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/secured/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      
      data.buffer.push("<i class=\"fa fa-edit\"></i>");
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        ");
      data.buffer.push(escapeExpression((helper = helpers['render-marked'] || (depth0 && depth0['render-marked']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "rawText", options) : helperMissing.call(depth0, "render-marked", "rawText", options))));
      data.buffer.push("\n    </div>\n</div>\n\n");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button secondary radius tiny fixed-bottom-right")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "secured.edit", options) : helperMissing.call(depth0, "link-to", "secured.edit", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/submission/action-menu", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<a ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'href': ("view.mainLink")
      },hashTypes:{'href': "ID"},hashContexts:{'href': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" class=\"button radius tiny split\">View <span ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'data-dropdown': ("view.dropdownId")
      },hashTypes:{'data-dropdown': "ID"},hashContexts:{'data-dropdown': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></span></a>\n<ul ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'id': ("view.dropdownId")
      },hashTypes:{'id': "ID"},hashContexts:{'id': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" class=\"f-dropdown\" data-dropdown-content>\n    <li><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "confirmDelete", "view.context", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push("><i class=\"fa fa-times\"></i> Delete</a></li>\n</ul>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/submission/confirm-delete", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h2>Confirm Delete</h2>\n        <p>Are you sure you want to delete the ");
      stack1 = helpers._triageMustache.call(depth0, "level.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      stack1 = helpers._triageMustache.call(depth0, "language.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" submission from ");
      stack1 = helpers._triageMustache.call(depth0, "candidateDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("?</p>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-3 large-offset-9 columns\">\n        <button class=\"button radius small right\" style=\"margin-left: 4px;\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Cancel</button>\n        <button class=\"button alert radius small right\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "deleteSubmission", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Delete</button>\n    </div>\n</div>\n");
      return buffer;
      }

      stack1 = (helper = helpers['modal-dialog'] || (depth0 && depth0['modal-dialog']),options={hash:{
        'action': ("closeModal")
      },hashTypes:{'action': "STRING"},hashContexts:{'action': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "modal-dialog", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/submission/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("(Closed)");
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n<div class=\"row display\">\n    <div class=\"large-12 columns\">\n        <label>Candidate</label>\n        <p>");
      stack1 = helpers._triageMustache.call(depth0, "candidateDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n    </div>\n</div>\n");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n<div class=\"row display\">\n    <div class=\"large-12 columns\">\n        <label>Average Score</label>\n        <p class=\"score\">");
      stack1 = helpers._triageMustache.call(depth0, "averageScore", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n    </div>\n</div>\n");
      return buffer;
      }

    function program7(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n<div class=\"row display\">\n    <div class=\"large-12 columns\">\n        ");
      stack1 = helpers['if'].call(depth0, "showCloseButton", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      stack1 = helpers['if'].call(depth0, "showReportButton", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n</div>\n");
      return buffer;
      }
    function program8(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n        <button class=\"button small radius\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeSubmission", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push(">Close Submission</button>\n        ");
      return buffer;
      }

    function program10(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button small radius")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "submission.report", options) : helperMissing.call(depth0, "link-to", "submission.report", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }
    function program11(depth0,data) {
      
      
      data.buffer.push("Generate Report");
      }

    function program13(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n            ");
      stack1 = helpers.each.call(depth0, "assessment", "in", "publishedAssessments", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(17, program17, data),fn:self.program(14, program14, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            ");
      return buffer;
      }
    function program14(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n                <tr class=\"assessment\">\n                    <td class=\"assessor\">");
      stack1 = helpers._triageMustache.call(depth0, "assessment.assessor", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td class=\"score\">");
      stack1 = helpers._triageMustache.call(depth0, "assessment.score", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td class=\"created-at\">");
      stack1 = helpers._triageMustache.call(depth0, "assessment.updatedAtDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>\n                        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button tiny radius")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "assessment.index", "assessment", options) : helperMissing.call(depth0, "link-to", "assessment.index", "assessment", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                    </td>\n                </tr>\n            ");
      return buffer;
      }
    function program15(depth0,data) {
      
      
      data.buffer.push("View");
      }

    function program17(depth0,data) {
      
      
      data.buffer.push("\n                <tr>\n                    <td colspan=\"4\" class=\"text-center\">No assessments yet.</td>\n                </tr>\n            ");
      }

    function program19(depth0,data) {
      
      
      data.buffer.push("\n            <tr><td class=\"text-center\" colspan=\"4\">All assessments will be visible once you've submitted yours.</td></tr>\n            ");
      }

    function program21(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n            ");
      stack1 = helpers['if'].call(depth0, "userCanCreateAssessment", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(22, program22, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }
    function program22(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n                ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button small radius success right")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "assessments.new", options) : helperMissing.call(depth0, "link-to", "assessments.new", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            ");
      return buffer;
      }
    function program23(depth0,data) {
      
      var stack1;
      stack1 = helpers._triageMustache.call(depth0, "newAssessmentButtonText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      }

    function program25(depth0,data) {
      
      
      data.buffer.push("\n            <p>This submission is closed for new assessments.</p>\n        ");
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>");
      stack1 = helpers._triageMustache.call(depth0, "level.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      stack1 = helpers._triageMustache.call(depth0, "language.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" Submission ");
      stack1 = helpers['if'].call(depth0, "isInactive", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h1>\n    </div>\n</div>\n\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h3>Details</h3>\n    </div>\n</div>\n");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<div class=\"row display\">\n    <div class=\"large-12 columns\">\n        <label>File</label>\n        <a class=\"button small radius success\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'href': ("zipfile")
      },hashTypes:{'href': "ID"},hashContexts:{'href': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("><i class=\"fa fa-download\"></i>&nbsp;Download</a>\n    </div>\n</div>\n<div class=\"row display\">\n    <div class=\"large-12 columns\">\n        <label>Email Text</label>\n        <p>");
      stack1 = helpers._triageMustache.call(depth0, "emailText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n    </div>\n</div>\n");
      stack1 = helpers['if'].call(depth0, "hasPublishedAssessments", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h3>Assessments</h3>\n\n        <table class=\"large-12 assessments\">\n            <thead>\n            <tr>\n                <th width=\"33%\">Assessor</th>\n                <th width=\"33%\">Score</th>\n                <th width=\"33%\">Completion Date</th>\n                <th></th>\n            </tr>\n            </thead>\n            <tbody>\n            ");
      stack1 = helpers['if'].call(depth0, "showAssessments", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(19, program19, data),fn:self.program(13, program13, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            </tbody>\n        </table>\n\n        ");
      stack1 = helpers['if'].call(depth0, "active", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(25, program25, data),fn:self.program(21, program21, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n</div>\n\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/submission/report", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '';
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Report for ");
      stack1 = helpers._triageMustache.call(depth0, "candidateName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h1>\n        <p>This report was generated from assessments by ");
      stack1 = helpers._triageMustache.call(depth0, "assessors", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(".</p>\n    </div>\n</div>\n\n<div class=\"row display\">\n    <div class=\"large-12 columns\">\n        <label>Average Score</label>\n        <p class=\"score\">");
      stack1 = helpers._triageMustache.call(depth0, "averageScore", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n    </div>\n</div>\n\n<div class=\"row display\">\n    <div class=\"large-12 columns report\">\n        ");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "report", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n</div>\n\n<!-- TODO: Remove this hack -->\n");
      stack1 = helpers.each.call(depth0, "assessments", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/submissions/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n                    <th width=\"40%\"> <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "activeSortBy", "candidateDisplay:asc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(" >Candidate</a></th>\n                    <th width=\"20%\"> <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "activeSortBy", "languageDisplay:asc, createdAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Language</a></th>\n                    <th width=\"20%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "activeSortBy", "level.text:asc, createdAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Level</a></th>\n                    <th width=\"20%\"><a href=\"#\"");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "activeSortBy", "createdAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Created date</a></th>\n                ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n                    <th width=\"33%\"> <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "activeSortBy", "languageDisplay:asc, createdAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Language</a></th>\n                    <th width=\"33%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "activeSortBy", "level.text:asc, createdAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Level</a></th>\n                    <th width=\"33%\"><a href=\"#\"");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "activeSortBy", "createdAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Created date</a></th>\n                ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n                <tr class=\"submission\">\n                    ");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.languageDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.level.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.createdAtDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>\n                    ");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                    </td>\n                </tr>\n                ");
      return buffer;
      }
    function program6(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.candidateDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    ");
      return buffer;
      }

    function program8(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n                        ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "submission/action-menu", {hash:{
        'context': ("submission")
      },hashTypes:{'context': "ID"},hashContexts:{'context': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push("\n                    ");
      return buffer;
      }

    function program10(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n                        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button tiny radius")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "submission.index", "submission", options) : helperMissing.call(depth0, "link-to", "submission.index", "submission", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                    ");
      return buffer;
      }
    function program11(depth0,data) {
      
      
      data.buffer.push("View");
      }

    function program13(depth0,data) {
      
      
      data.buffer.push("\n                <tr>\n                    <td colspan=\"5\" class=\"text-center\">There are no active submissions.</td>\n                </tr>\n                ");
      }

    function program15(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'classNames': ("button small radius success right")
      },hashTypes:{'classNames': "STRING"},hashContexts:{'classNames': depth0},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "submissions.new", options) : helperMissing.call(depth0, "link-to", "submissions.new", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n</div>\n");
      return buffer;
      }
    function program16(depth0,data) {
      
      
      data.buffer.push("New Submission");
      }

    function program18(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n                <th width=\"30%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "candidateDisplay:asc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Candidate</a></th>\n                <th width=\"10%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "averageScore:desc, updatedAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Score</a></th>\n                <th width=\"20%\"> <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "languageDisplay:asc, updatedAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Language</a></th>\n                <th width=\"20%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "level.text:asc, updatedAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Level</a></th>\n                <th width=\"20%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "updatedAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Closed At</a></th>\n            ");
      return buffer;
      }

    function program20(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n                <th width=\"40%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "averageScore:desc, updatedAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Score</a></th>\n                <th width=\"20%\"> <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "languageDisplay:asc, updatedAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Language</a></th>\n                <th width=\"20%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "level.text:asc, updatedAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Level</a></th>\n                <th width=\"20%\"><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "inactiveSortBy", "updatedAtDisplay:desc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Closed At</a></th>\n            ");
      return buffer;
      }

    function program22(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n                <tr class=\"submission\">\n                    ");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.averageScore", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.languageDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.level.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.updatedAtDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>\n                    ");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                    </td>\n                </tr>\n            ");
      return buffer;
      }
    function program23(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n                        <td>");
      stack1 = helpers._triageMustache.call(depth0, "submission.candidateDisplay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    ");
      return buffer;
      }

    function program25(depth0,data) {
      
      
      data.buffer.push("\n                <tr>\n                    <td colspan=\"6\" class=\"text-center\">There are no inactive submissions.</td>\n                </tr>\n            ");
      }

      data.buffer.push("\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Active Submissions </h1>\n\n        <table width=\"100%\">\n            <thead>\n                <tr>\n                ");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                ");
      stack1 = helpers.each.call(depth0, "submission", "in", "activeSubmissions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(13, program13, data),fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            </tbody>\n        </table>\n    </div>\n</div>\n");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Inactive Submissions</h1>\n\n        <table width=\"100%\">\n            <thead>\n            <tr>\n            ");
      stack1 = helpers['if'].call(depth0, "isRecruiter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(20, program20, data),fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                <th></th>\n            </tr>\n            </thead>\n            <tbody>\n            ");
      stack1 = helpers.each.call(depth0, "submission", "in", "inactiveSubmissions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(25, program25, data),fn:self.program(22, program22, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            </tbody>\n        </table>\n    </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/submissions/new", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>New Submission</h1>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <label>Candidate Name\n            ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("candidateName"),
        'placeholder': ("Name")
      },hashTypes:{'value': "ID",'placeholder': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n        </label>\n        <label>Candidate Email\n            ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("candidateEmail"),
        'placeholder': ("Email Address")
      },hashTypes:{'value': "ID",'placeholder': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n        </label>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-4 columns\">\n        ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
        'viewName': ("select"),
        'contentBinding': ("levels"),
        'optionLabelPath': ("content.text"),
        'optionValuePath': ("content.id"),
        'prompt': ("Select candidate level:"),
        'selectionBinding': ("selectedLevel")
      },hashTypes:{'viewName': "STRING",'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'prompt': "STRING",'selectionBinding': "STRING"},hashContexts:{'viewName': depth0,'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'prompt': depth0,'selectionBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-4 columns\">\n        ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
        'viewName': ("select"),
        'id': ("language-select"),
        'contentBinding': ("languages"),
        'optionLabelPath': ("content.name"),
        'optionValuePath': ("content.id"),
        'prompt': ("Select a language:"),
        'selectionBinding': ("selectedLanguage")
      },hashTypes:{'viewName': "STRING",'id': "STRING",'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'prompt': "STRING",'selectionBinding': "STRING"},hashContexts:{'viewName': depth0,'id': depth0,'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'prompt': depth0,'selectionBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <label>Copy and paste the email text or any instructions given by the candidate.\n            ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("submission.emailText"),
        'rows': ("6"),
        'placeholder': ("Email text or instructions"),
        'id': ("email-text")
      },hashTypes:{'value': "ID",'rows': "STRING",'placeholder': "STRING",'id': "STRING"},hashContexts:{'value': depth0,'rows': depth0,'placeholder': depth0,'id': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n        </label>\n        <label>Select the zipfile provided by the candidate.\n            ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "file-upload", {hash:{
        'name': ("zipfile"),
        'file': ("submission.zipfile"),
        'id': ("zipfile"),
        'fileName': ("submission.fileName")
      },hashTypes:{'name': "STRING",'file': "ID",'id': "STRING",'fileName': "ID"},hashContexts:{'name': depth0,'file': depth0,'id': depth0,'fileName': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push("\n        </label>\n        <input id=\"submit-button\" type=\"button\" value=\"Create New Codetest!\" class=\"button small radius success\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'disabled': ("isFormIncomplete")
      },hashTypes:{'disabled': "ID"},hashContexts:{'disabled': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "submit", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("/>\n    </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/user/edit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"row\">\n        <div class=\"large-12 columns\">\n            <h1>Edit ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </h1>\n        </div>\n    </div>\n<div class=\"row\">\n        <div id=\"role-warning\" class=\"warning\"></div>\n        <div class=\"large-12 columns\">\n            <table class=\"user-roles\">\n                <thead>\n            <tr>\n                    <th class=\"large-3\">Name</th>\n                    <th class=\"large-3\">Email</th>\n                    <th class=\"large-3\">Current Role</th>\n                    <th class=\"large-3\">Change Role</th>\n                    <th></th>\n                </tr>\n            </thead>\n                <tbody>\n            <tr>\n                    <td class=\"name\">");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td class=\"email\">");
      stack1 = helpers._triageMustache.call(depth0, "email", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>");
      stack1 = helpers._triageMustache.call(depth0, "role.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td class=\"role\">\n                        ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
        'id': ("role-select"),
        'prompt': ("Please select a role"),
        'contentBinding': ("all_roles"),
        'optionValuePath': ("content.id"),
        'optionLabelPath': ("content.name"),
        'selection': ("selectedRole")
      },hashTypes:{'id': "STRING",'prompt': "STRING",'contentBinding': "STRING",'optionValuePath': "STRING",'optionLabelPath': "STRING",'selection': "ID"},hashContexts:{'id': depth0,'prompt': depth0,'contentBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'selection': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n                    <td><button id=\"add-role\" class=\"button tiny\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeRole", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">change role</button></td>\n                </tr>\n            </tbody>\n            </table>\n        </div>\n    </div>");
      return buffer;
      
    });
  });
;define("code-test-bot-app/templates/users/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n                <tr>\n                    <td class=\"name\">");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td class=\"email\">");
      stack1 = helpers._triageMustache.call(depth0, "email", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td class=\"role\">");
      stack1 = helpers._triageMustache.call(depth0, "role.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                    <td>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button small radius"),
        'disabled': ("editDisabled")
      },hashTypes:{'class': "STRING",'disabled': "ID"},hashContexts:{'class': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "user.edit", "", options) : helperMissing.call(depth0, "link-to", "user.edit", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n                </tr>\n            ");
      return buffer;
      }
    function program2(depth0,data) {
      
      
      data.buffer.push("Edit");
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <h1>Users</h1>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"large-12 columns\">\n        <table class=\"large-12 users\">\n            <thead>\n            <tr>\n                <th class=\"large-3\">Name</th>\n                <th class=\"large-6\">Email</th>\n                <th class=\"large-3\">Role</th>\n                <th></th>\n            </tr>\n            </thead>\n            <tbody>\n            ");
      stack1 = helpers.each.call(depth0, {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            </tbody>\n        </table>\n    </div>\n</div>\n");
      return buffer;
      
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/adapters/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/adapters');
    test('code-test-bot-app/adapters/application.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/adapters/application.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app');
    test('code-test-bot-app/app.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/app.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/components/modal-dialog.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/components');
    test('code-test-bot-app/components/modal-dialog.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/components/modal-dialog.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers');
    test('code-test-bot-app/controllers/application.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/application.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/assessment/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/assessment');
    test('code-test-bot-app/controllers/assessment/edit.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/assessment/edit.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/assessment/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/assessment');
    test('code-test-bot-app/controllers/assessment/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/assessment/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/assessments/new.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/assessments');
    test('code-test-bot-app/controllers/assessments/new.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/assessments/new.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/auth/login.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/auth');
    test('code-test-bot-app/controllers/auth/login.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/auth/login.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/error.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers');
    test('code-test-bot-app/controllers/error.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/error.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/menu.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers');
    test('code-test-bot-app/controllers/menu.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/menu.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/secured/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/secured');
    test('code-test-bot-app/controllers/secured/edit.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/secured/edit.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/submission/confirm-delete.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/submission');
    test('code-test-bot-app/controllers/submission/confirm-delete.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/submission/confirm-delete.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/submission/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/submission');
    test('code-test-bot-app/controllers/submission/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/submission/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/submission/report.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/submission');
    test('code-test-bot-app/controllers/submission/report.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/submission/report.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/submissions/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/submissions');
    test('code-test-bot-app/controllers/submissions/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/submissions/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/submissions/new.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/submissions');
    test('code-test-bot-app/controllers/submissions/new.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/submissions/new.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/user.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers');
    test('code-test-bot-app/controllers/user.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/user.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/user/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/user');
    test('code-test-bot-app/controllers/user/edit.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/user/edit.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/controllers/users/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/controllers/users');
    test('code-test-bot-app/controllers/users/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/controllers/users/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/helpers/render-marked.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/helpers');
    test('code-test-bot-app/helpers/render-marked.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/helpers/render-marked.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/initializers/authentication.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/initializers');
    test('code-test-bot-app/initializers/authentication.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/initializers/authentication.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/initializers/stores.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/initializers');
    test('code-test-bot-app/initializers/stores.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/initializers/stores.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/lib/auth/www-authenticate-header.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/lib/auth');
    test('code-test-bot-app/lib/auth/www-authenticate-header.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/lib/auth/www-authenticate-header.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/lib/ember-simple-auth/authenticators');
    test('code-test-bot-app/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/lib/stores/base.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/lib/stores');
    test('code-test-bot-app/lib/stores/base.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/lib/stores/base.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/lib/stores/ephemeral.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/lib/stores');
    test('code-test-bot-app/lib/stores/ephemeral.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/lib/stores/ephemeral.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/lib/stores/local.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/lib/stores');
    test('code-test-bot-app/lib/stores/local.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/lib/stores/local.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/lib/window-location-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/lib');
    test('code-test-bot-app/lib/window-location-helper.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/lib/window-location-helper.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/mixins/auto-saveable.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/mixins');
    test('code-test-bot-app/mixins/auto-saveable.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/mixins/auto-saveable.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/mixins/user-aware-controller.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/mixins');
    test('code-test-bot-app/mixins/user-aware-controller.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/mixins/user-aware-controller.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/mixins/user-aware-route.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/mixins');
    test('code-test-bot-app/mixins/user-aware-route.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/mixins/user-aware-route.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/mixins/user-aware.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/mixins');
    test('code-test-bot-app/mixins/user-aware.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/mixins/user-aware.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/assessment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/assessment.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/assessment.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/assessor.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/assessor.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/assessor.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/language.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/language.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/language.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/level.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/level.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/level.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/page.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/page.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/page.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/role.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/role.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/role.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/session.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/session.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/session.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/submission.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/submission.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/submission.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/models/user.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/models');
    test('code-test-bot-app/models/user.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/models/user.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app');
    test('code-test-bot-app/router.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/router.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/admin.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes');
    test('code-test-bot-app/routes/admin.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/admin.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes');
    test('code-test-bot-app/routes/application.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/application.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/assessments/new.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes/assessments');
    test('code-test-bot-app/routes/assessments/new.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/assessments/new.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/auth/complete.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes/auth');
    test('code-test-bot-app/routes/auth/complete.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/auth/complete.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/auth/login.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes/auth');
    test('code-test-bot-app/routes/auth/login.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/auth/login.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/secured.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes');
    test('code-test-bot-app/routes/secured.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/secured.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/secured/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes/secured');
    test('code-test-bot-app/routes/secured/edit.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/secured/edit.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/secured/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes/secured');
    test('code-test-bot-app/routes/secured/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/secured/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/submissions/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes/submissions');
    test('code-test-bot-app/routes/submissions/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/submissions/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/submissions/new.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes/submissions');
    test('code-test-bot-app/routes/submissions/new.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/submissions/new.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/routes/users/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/routes/users');
    test('code-test-bot-app/routes/users/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/routes/users/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/fixtures.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests');
    test('code-test-bot-app/tests/fixtures.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/fixtures.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/helpers/authentication.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/helpers');
    test('code-test-bot-app/tests/helpers/authentication.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/helpers/authentication.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/helpers/data.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/helpers');
    test('code-test-bot-app/tests/helpers/data.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/helpers/data.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/helpers/dom-helpers.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/helpers');
    test('code-test-bot-app/tests/helpers/dom-helpers.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/helpers/dom-helpers.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/helpers/fake-server.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/helpers');
    test('code-test-bot-app/tests/helpers/fake-server.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/helpers/fake-server.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/helpers');
    test('code-test-bot-app/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/helpers');
    test('code-test-bot-app/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/helpers/test-for.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/helpers');
    test('code-test-bot-app/tests/helpers/test-for.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/helpers/test-for.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/helpers/utils.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/helpers');
    test('code-test-bot-app/tests/helpers/utils.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/helpers/utils.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/integration/assessments/assessments-new-integration-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/integration/assessments');
    test('code-test-bot-app/tests/integration/assessments/assessments-new-integration-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/integration/assessments/assessments-new-integration-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/integration/auth-complete-integration-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/integration');
    test('code-test-bot-app/tests/integration/auth-complete-integration-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/integration/auth-complete-integration-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/integration/authenticated-routes-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/integration');
    test('code-test-bot-app/tests/integration/authenticated-routes-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/integration/authenticated-routes-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/integration/authentication/expired-credentials-integration-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/integration/authentication');
    test('code-test-bot-app/tests/integration/authentication/expired-credentials-integration-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/integration/authentication/expired-credentials-integration-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/integration/submissions/submissions-integration-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/integration/submissions');
    test('code-test-bot-app/tests/integration/submissions/submissions-integration-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/integration/submissions/submissions-integration-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/integration/users/users-index-integration-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/integration/users');
    test('code-test-bot-app/tests/integration/users/users-index-integration-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/integration/users/users-index-integration-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests');
    test('code-test-bot-app/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/test-helper.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/test-loader.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests');
    test('code-test-bot-app/tests/test-loader.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/test-loader.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/controllers/assessment/assessment-edit-controller-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/controllers/assessment');
    test('code-test-bot-app/tests/unit/controllers/assessment/assessment-edit-controller-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/controllers/assessment/assessment-edit-controller-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/controllers/assessment/assessment-index-controller-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/controllers/assessment');
    test('code-test-bot-app/tests/unit/controllers/assessment/assessment-index-controller-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/controllers/assessment/assessment-index-controller-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/controllers/assessments/assessments-new-controller-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/controllers/assessments');
    test('code-test-bot-app/tests/unit/controllers/assessments/assessments-new-controller-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/controllers/assessments/assessments-new-controller-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/controllers/auth/auth-login-controller-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/controllers/auth');
    test('code-test-bot-app/tests/unit/controllers/auth/auth-login-controller-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/controllers/auth/auth-login-controller-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/controllers/submissions/submissions-new-controller-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/controllers/submissions');
    test('code-test-bot-app/tests/unit/controllers/submissions/submissions-new-controller-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/controllers/submissions/submissions-new-controller-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/controllers/user/user-edit-controller-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/controllers/user');
    test('code-test-bot-app/tests/unit/controllers/user/user-edit-controller-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/controllers/user/user-edit-controller-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/lib/auth/www-authenticate-header-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/lib/auth');
    test('code-test-bot-app/tests/unit/lib/auth/www-authenticate-header-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/lib/auth/www-authenticate-header-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/lib/ember-simple-auth/authenticators');
    test('code-test-bot-app/tests/unit/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/lib/stores/ephemeral-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/lib/stores');
    test('code-test-bot-app/tests/unit/lib/stores/ephemeral-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/lib/stores/ephemeral-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/lib/stores/local-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/lib/stores');
    test('code-test-bot-app/tests/unit/lib/stores/local-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/lib/stores/local-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/mixins/auto-saveable-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/mixins');
    test('code-test-bot-app/tests/unit/mixins/auto-saveable-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/mixins/auto-saveable-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/routes/auth/auth-login-route-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/routes/auth');
    test('code-test-bot-app/tests/unit/routes/auth/auth-login-route-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/routes/auth/auth-login-route-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/routes/submissions/submissions-index-route-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/routes/submissions');
    test('code-test-bot-app/tests/unit/routes/submissions/submissions-index-route-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/routes/submissions/submissions-index-route-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/routes/submissions/submissions-new-route-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/routes/submissions');
    test('code-test-bot-app/tests/unit/routes/submissions/submissions-new-route-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/routes/submissions/submissions-new-route-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/tests/unit/utils/math-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/tests/unit/utils');
    test('code-test-bot-app/tests/unit/utils/math-test.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/tests/unit/utils/math-test.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/utils/math.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/utils');
    test('code-test-bot-app/utils/math.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/utils/math.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/views/candidates/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/views/candidates');
    test('code-test-bot-app/views/candidates/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/views/candidates/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/views/file-upload.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/views');
    test('code-test-bot-app/views/file-upload.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/views/file-upload.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/views/foundation.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/views');
    test('code-test-bot-app/views/foundation.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/views/foundation.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/views/menu.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/views');
    test('code-test-bot-app/views/menu.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/views/menu.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/views/saving-indicator.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/views');
    test('code-test-bot-app/views/saving-indicator.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/views/saving-indicator.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/views/secured/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/views/secured');
    test('code-test-bot-app/views/secured/edit.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/views/secured/edit.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/views/submission/action-menu.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/views/submission');
    test('code-test-bot-app/views/submission/action-menu.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/views/submission/action-menu.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/code-test-bot-app/views/submissions/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - code-test-bot-app/views/submissions');
    test('code-test-bot-app/views/submissions/index.js should pass jshint', function() { 
      ok(true, 'code-test-bot-app/views/submissions/index.js should pass jshint.'); 
    });
  });
;define("code-test-bot-app/tests/fixtures", 
  ["ic-ajax","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* globals CodeTestBotAppENV */

    var defineFixture = __dependency1__.defineFixture;

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

    __exports__.defineServerFixture = defineServerFixture;

    __exports__["default"] = {};
  });
;define("code-test-bot-app/tests/helpers/authentication", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function authenticateSession() {
        var session = getSession();
        session.authenticate('authenticator:out-of-band-token', {
            access_token: 'fake_token',
            expires_at: (new Date().getTime() / 1000) + 86400,
            expires: true
        });
    }

    function getSession() {
        return CodeTestBotApp.__container__.lookup('session:main');
    }

    __exports__.authenticateSession = authenticateSession;
    __exports__.getSession = getSession;
  });
;define("code-test-bot-app/tests/helpers/data", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function injectFakeStore(target) {
        var store = { createRecord: function() {}, find: function() {} };
        target.store = store;
        return store;
    }

    __exports__.injectFakeStore = injectFakeStore;
  });
;define("code-test-bot-app/tests/helpers/dom-helpers", 
  [],
  function() {
    "use strict";

    Ember.Test.registerHelper('shouldContainText', function(app, selector, text, context) {
        var el = findWithAssert(selector, context);
        var index = el.text().indexOf(text);
        ok(index !== -1, 'expected text not found');
    });
  });
;define("code-test-bot-app/tests/helpers/fake-server", 
  ["exports"],
  function(__exports__) {
    "use strict";

    var __server__;

    function start() {
        __server__ = sinon.fakeServer.create();
        __server__.autoRespond = true;
        __server__.respondWith(function(request) {
            console.error('Unhandled request ' + request.method + ' ' + request.url);
            request.respond([404, {}, '']);
        });
    }

    function stop() {
        __server__.restore();
    }

    function respondWith(method, url, response) {
        __server__.respondWith(method, url, response);
    }

    function jsonSuccess(method, url, response) {
        respondWith(method, url, [200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]);
    }

    __exports__["default"] = {
        start: start,
        stop: stop,
        respondWith: respondWith,
        jsonSuccess: jsonSuccess
    };
  });
;define("code-test-bot-app/tests/helpers/resolver", 
  ["ember/resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: 'code-test-bot-app'
    };

    __exports__["default"] = resolver;
  });
;define("code-test-bot-app/tests/helpers/start-app", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var Application = require('code-test-bot-app/app')['default'];
    var Router = require('code-test-bot-app/router')['default'];

    function startApp(attrs) {
      var App;

      var attributes = Ember.merge({
        // useful Test defaults
        rootElement: '#ember-testing',
        LOG_ACTIVE_GENERATION:false,
        LOG_VIEW_LOOKUPS: false
      }, attrs); // but you can override;

      Router.reopen({
        location: 'none'
      });

      Ember.run(function(){
        App = Application.create(attributes);
        App.setupForTesting();
        App.injectTestHelpers();
      });

      App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

      return App;
    }

    function startAppEphemeral(attrs) {
        attrs = Ember.merge({ storeFactory: 'session-store:ephemeral', dataStore: 'data-store:ephemeral' }, attrs);
        return window.CodeTestBotApp = startApp(attrs);
    }

    __exports__.startAppEphemeral = startAppEphemeral;function resetApp() {
        window.CodeTestBotApp.reset();
    }

    __exports__.resetApp = resetApp;__exports__["default"] = startApp;
  });
;define("code-test-bot-app/tests/helpers/test-for", 
  ["code-test-bot-app/tests/helpers/resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var resolver = __dependency1__["default"];

    // TODO: Remove when ember-qunit/qunit-bdd situation is sorted out.
    // Temporary hack that follows the proposed API for BDD test frameworks,
    // i.e. describe('Some Controller', testFor('controller:some/controller', function() { ... }));
    // Provides a this.subject() helper like ember-qunit gives with moduleFor.
    __exports__["default"] = function testFor(fullName, body) {
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
  });
;define("code-test-bot-app/tests/helpers/utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function randomElement(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }

    __exports__.randomElement = randomElement;
  });
;define("code-test-bot-app/tests/integration/assessments/assessments-new-integration-test", 
  ["ember-qunit","code-test-bot-app/tests/helpers/start-app","code-test-bot-app/tests/helpers/authentication","code-test-bot-app/tests/fixtures","code-test-bot-app/tests/helpers/fake-server"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
    "use strict";
    var test = __dependency1__.test;
    var startAppEphemeral = __dependency2__.startAppEphemeral;
    var resetApp = __dependency2__.resetApp;
    var authenticateSession = __dependency3__.authenticateSession;
    var defineServerFixture = __dependency4__.defineServerFixture;
    var fakeServer = __dependency5__["default"];

    module('Integration - assessments/new', {
        setup: function() {
            startAppEphemeral();

            fakeServer.start();
            fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
                session: { id: 1, user_id: 1 }, 
                users: [{id: 1, name: 'User1', role_id: 1}],
                roles: [{id: 1, name: 'Assessor'}]
            })]);

            visit('/auth/login').then(authenticateSession);
        },
        teardown: function() {
            resetApp();
            fakeServer.stop();
        }
    });

    test('displays a form to create an assessment', function() {
        expect(4);

        fakeServer.jsonSuccess('GET', 'http://localhost:3000/assessments?submission_id=1&assessor_id=1&include_unpublished=true', { assessments: []});

        visit('/submissions/1/assessments/new');
        andThen(function() {
            equal(find('select.language').val(), 1);
            equal(find('select.level').val(), 1);
            equal(find('textarea.email-text').val(), 'some text');
            equal(find('a.zipfile').attr('href'), 'url to file');
        });
    });

    test('saves the assessment and redirects to the submission details page', function() {
        expect(1);

        fakeServer.jsonSuccess('POST', 'http://localhost:3000/assessments', { assessment: { id: 33, score: 1, notes: 'notes', submission_id: 1 } });
        fakeServer.jsonSuccess('PUT', 'http://localhost:3000/assessments/33', { assessment: { id: 33, score: 1, notes: 'notes', submission_id: 1 } });
        fakeServer.jsonSuccess('GET', 'http://localhost:3000/assessments?submission_id=1&assessor_id=1&include_unpublished=true', { assessments: []});
        fakeServer.jsonSuccess('GET', 'http://localhost:3000/assessments?submission_id=1&include_unpublished=true', { assessments: [] });

        visit('/submissions/1/assessments/new');
        fillIn('input.score', '1');
        fillIn('textarea.notes', 'notes');
        click('button.create');
        andThen(function() {
            equal(currentURL(), '/submissions/1');
        });
    });
  });
;define("code-test-bot-app/tests/integration/auth-complete-integration-test", 
  ["ember-qunit","code-test-bot-app/tests/helpers/start-app","code-test-bot-app/tests/helpers/authentication","code-test-bot-app/tests/helpers/fake-server"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
    "use strict";
    var test = __dependency1__.test;
    var startAppEphemeral = __dependency2__.startAppEphemeral;
    var resetApp = __dependency2__.resetApp;
    var getSession = __dependency3__.getSession;
    var fakeServer = __dependency4__["default"];

    module('Auth Complete Integration', {
        setup: function() {
            fakeServer.start();
            fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
                session: { id: 1, user_id: 1 }, 
                users: [{id: 1, name: 'User1', role_id: 1}],
                roles: [{id: 1, name: 'Assessor'}]
            })]);
            startAppEphemeral();
        },
        teardown: function() {
            resetApp();
            fakeServer.stop();
        }
    });

    var url = '/auth/complete?token=token1234&expires_at=5000&expires=true';

    test('authenticates the session with the OutOfBandTokenAuthenticator', function() {
        expect(3);

        visit(url);
        andThen(function() {
            var session = getSession();
            equal(session.get('access_token'), 'token1234');
            equal(session.get('expires_at'), 5000000);
            equal(session.get('expires'), true);
        });
    });

    test('transitions to the previously attempted transition after authentication', function() {
        expect(1);

        var store = CodeTestBotApp.get('dataStore');
        store.setItem('attemptedTransition', '/submissions/new');

        visit(url);
        andThen(function() {
            equal(currentURL(), '/submissions/new');
        });
    });
  });
;define("code-test-bot-app/tests/integration/authenticated-routes-test", 
  ["ember-qunit","code-test-bot-app/tests/helpers/start-app","code-test-bot-app/tests/helpers/authentication","code-test-bot-app/tests/helpers/fake-server"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleFor = __dependency1__.moduleFor;
    var startAppEphemeral = __dependency2__.startAppEphemeral;
    var resetApp = __dependency2__.resetApp;
    var authenticateSession = __dependency3__.authenticateSession;
    var fakeServer = __dependency4__["default"];

    module('Authenticated Route', {
        setup: function() {
            fakeServer.start();
            startAppEphemeral();
        },
        teardown: function() {
            resetApp();
            fakeServer.stop();
        }
    });

    test('when session not authenticated, saves transition intent and transitions to login', function() {
        expect(2);

        var store = CodeTestBotApp.get('dataStore');

        visit('/submissions/new');
        andThen(function() {
            equal(store.getItem('attemptedTransition'), '/submissions/new');
            equal(currentRouteName(), 'auth.login');
        });
    });

    test('when session is authenticated, continues transition like normal', function() {
        expect(1);

        fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
            session: { id: 1, user_id: 1 }, 
            users: [{id: 1, name: 'User1', role_id: 1}],
            roles: [{id: 1, name: 'Assessor'}]
        })]);
        visit('/auth/login').then(authenticateSession);

        visit('/submissions/new');
        andThen(function() {
            equal(currentRouteName(), 'submissions.new');
        });
    });
  });
;define("code-test-bot-app/tests/integration/authentication/expired-credentials-integration-test", 
  ["code-test-bot-app/tests/helpers/start-app","code-test-bot-app/tests/helpers/authentication","code-test-bot-app/tests/helpers/fake-server"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    var startAppEphemeral = __dependency1__.startAppEphemeral;
    var resetApp = __dependency1__.resetApp;
    var authenticateSession = __dependency2__.authenticateSession;
    var fakeServer = __dependency3__["default"];

    describe('Integration - expired credentials', function() {
        before(function() {
            fakeServer.start();
            fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
                session: { id: 1, user_id: 1 }, 
                users: [{id: 1, name: 'User1', role_id: 1}],
                roles: [{id: 1, name: 'Assessor'}]
            })]);
            startAppEphemeral();
        });

        after(function() {
            resetApp();
            fakeServer.stop();
        });

        context('when server responds with invalid_token', function() {
            before(function() {
                fakeServer.respondWith('GET', 'http://localhost:3000/submissions/2', [401, { 'WWW-Authenticate': 'Bearer error="invalid_token"' }, '']);
                visit('/auth/login').then(authenticateSession);
            });

            it('redirects to the login page', function() {
                expect(1);
                console.log('out');
                visit('/submissions/2');
                andThen(function() {
                    console.log('out2');
                    expect(currentRouteName()).to.equal('auth.login');
                });
            });
        });
    });
  });
;define("code-test-bot-app/tests/integration/submissions/submissions-integration-test", 
  ["code-test-bot-app/tests/helpers/start-app","code-test-bot-app/tests/helpers/authentication","code-test-bot-app/tests/helpers/fake-server","code-test-bot-app/tests/helpers/dom-helpers"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
    "use strict";
    var startAppEphemeral = __dependency1__.startAppEphemeral;
    var resetApp = __dependency1__.resetApp;
    var authenticateSession = __dependency2__.authenticateSession;
    var fakeServer = __dependency3__["default"];

    describe('Integration - submissions', function() {
        before(function() {
            fakeServer.start();
            startAppEphemeral();
            fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
                session: { id: 1, user_id: 1 }, 
                users: [{id: 1, name: 'User1', role_id: 1}],
                roles: [{id: 1, name: 'Assessor'}]
            })]);
            visit('/auth/login').then(authenticateSession);
        });

        after(function() {
            resetApp();
            fakeServer.stop();
        });

        describe('new route', function() {
            before(function() { visit('/submissions/new'); });

            context('when leaving route with unsaved submission', function() {
                before(function() {
                    fakeServer.jsonSuccess('GET', 'http://localhost:3000/submissions', { submissions: [] });
                    visit('/submissions');
                });

                it('deletes the unsaved record', function() {
                    expect(1);

                    andThen(function() {
                        expect(find('tr.submission').length).to.equal(0);
                    });
                });
            });
        });

        describe('detail page', function() {
            context('when user has not submitted an assessment', function() {
                before(function() {
                    fakeServer.jsonSuccess('GET', 'http://localhost:3000/assessments?submission_id=1&include_unpublished=true', { assessments: [
                        { id: 2, score: 4, notes: 'notes', submission_id: 1, assessor_id: 3 }
                    ]});
                });

                it('shows a no assessments message', function() {
                    expect(1);

                    visit('/submissions/1');
                    andThen(function() {
                        shouldContainText('table.assessments', 'All assessments will be visible');
                    });
                });
            });

            context('when assessments exist', function() {
                before(function() {
                    fakeServer.jsonSuccess('GET', 'http://localhost:3000/assessments?submission_id=1&include_unpublished=true', { assessments: [
                        { id: 1, score: 2, notes: 'notes', submission_id: 1, assessor_id: 2, published: true },
                        { id: 2, score: 4, notes: 'notes', submission_id: 1, assessor_id: 3, published: true }
                    ]});
                });

                /*
                it('shows a list of assessments', function() {
                    expect(1);

                    visit('/submissions/1');
                    andThen(function() {
                        expect(find('tr.assessment').length).to.equal(2);
                    });
                });
                */

                it('shows an average score', function() {
                    expect(1);

                    visit('/submissions/1');
                    andThen(function() {
                        expect(find('p.score').text()).to.equal('3');
                    });
                });
            });
        });
    });
  });
;define("code-test-bot-app/tests/integration/users/users-index-integration-test", 
  [],
  function() {
    "use strict";
    /* Commented out until we can figure out why user role is so sketchy in tests.
     
    import { test } from 'ember-qunit';
    import { startAppEphemeral, resetApp } from '../../helpers/start-app';
    import { authenticateSession } from '../../helpers/authentication';
    import fakeServer from '../../helpers/fake-server';

    module('Users Index Integration', {
        setup: function() {
            fakeServer.start();
            fakeServer.respondWith('GET', 'http://localhost:3000/sessions/current', [200, { "Content-Type": "application/json" }, JSON.stringify({ 
                session: { id: 1, user_id: 2 }, 
                users: [{id: 2, name: 'User2', role_id: 3}],
                roles: [{id: 3, name: 'Administrator'}]
            })]);
            startAppEphemeral();
            visit('/auth/login').then(authenticateSession);
        },
        teardown: function() {
            resetApp();
            fakeServer.stop();
        }
    });

    test('displays a list of users', function() {
        expect(2);

        visit('/admin/users');
        andThen(function() {
            var names = [];
            find('td.name').each(function() {
                names.push($(this).text());
            });

            equal(names[0], 'User2');
            equal(names[1], 'User1');
        });
    });

    test('can transition to user edit', function() {
        expect(2);

        visit('/admin/users');
        click('.button[href="/admin/users/1/edit"]');
        andThen(function() {
            equal(currentRouteName(), 'user.edit');
            equal(currentURL(), '/admin/users/1/edit');
        });
    });

    test('edit button is enabled for editable users', function() {
        expect(1);

        visit('/admin/users');
        andThen(function() {
            var button = find('a.button[href="/admin/users/1/edit"]');
            ok(!button.hasClass('disabled'), 'Edit button should not be disabled');
        });
    });

    test('edit button is disabled for uneditable users', function() {
        expect(1);

        visit('/admin/users');
        andThen(function() {
            var button = find('a.button[href="/admin/users/2/edit"]');
            ok(button.hasClass('disabled'), 'Edit button should be disabled');
        });
    });
    */
  });
;define("code-test-bot-app/tests/test-helper", 
  ["code-test-bot-app/tests/helpers/resolver","code-test-bot-app/lib/window-location-helper","code-test-bot-app/tests/fixtures"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    /* globals sinon */

    document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

    Ember.testing = true;

    var resolver = __dependency1__["default"];
    require('ember-qunit').setResolver(resolver);

    var WindowLocationHelper = __dependency2__["default"];
    sinon.stub(WindowLocationHelper, 'setLocation');

    function exists(selector) {
      return !!window.find(selector).length;
    }

    function getAssertionMessage(actual, expected, message) {
      return message || QUnit.jsDump.parse(expected) + " expected but was " + QUnit.jsDump.parse(actual);
    }

    function equal(actual, expected, message) {
      message = getAssertionMessage(actual, expected, message);
      QUnit.equal.call(this, actual, expected, message);
    }

    function strictEqual(actual, expected, message) {
      message = getAssertionMessage(actual, expected, message);
      QUnit.strictEqual.call(this, actual, expected, message);
    }

    window.exists = exists;
    window.equal = equal;
    window.strictEqual = strictEqual;

    QUnit.config.testTimeout = 5000;
  });
;define("code-test-bot-app/tests/test-loader", 
  [],
  function() {
    "use strict";
    // TODO: load based on params
    Ember.keys(requirejs.entries).forEach(function(entry) {
        if ((/\-test/).test(entry)) {
            require(entry, null, null, true);
        }
    });
  });
;define("code-test-bot-app/tests/unit/controllers/assessment/assessment-edit-controller-test", 
  ["ember-qunit","code-test-bot-app/tests/helpers/utils"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    /* globals moment */

    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;
    var randomElement = __dependency2__.randomElement;

    var controller, createdAt, assessment, model, user, assessor;
    moduleFor('controller:assessment/edit', 'Assessment Edit Controller', {
        needs: ['controller:application'],

        setup: function() {
            controller = this.subject();
            createdAt = moment();
            assessment = Ember.Object.create({
                score: 1,
                notes: 'some notes',
                createdAtMoment: createdAt
            });

            model = Ember.Object.create({
                assessment: assessment
            });

            user = Ember.Object.create({
                id: 1,
                name: 'Bob'
            });

            assessor = Ember.Object.create({
                id: 1,
                name: 'Bob'
            });

            controller.set('content', assessment);
            controller.set('user', user);
            controller.set('assessor', assessor);
        }
    });

    test('ownAssessment is false if user id and assessor id dont match', function() {
        assessor.id = 5;
        user.id = 1;
        equal(controller.get('ownAssessment'), false);
    });

    test('notOwnAssessment is true if user id and assessor id dont match', function() {
        assessor.id = 5;
        user.id = 1;
        equal(controller.get('notOwnAssessment'), true);
    });

    test('ownAssessment is true if user id and assessor id match', function() {
        assessor.id = 2;
        user.id = 2;
        equal(controller.get('ownAssessment'), true);
    });

    test('notOwnAssessment is false if user id and assessor id match', function() {
        assessor.id = 5;
        user.id = 5;
        equal(controller.get('notOwnAssessment'), false);
    });
  });
;define("code-test-bot-app/tests/unit/controllers/assessment/assessment-index-controller-test", 
  ["ember-qunit","code-test-bot-app/tests/helpers/utils"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    /* globals moment */

    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;
    var randomElement = __dependency2__.randomElement;

    var controller, createdAt, assessment, model, user, assessor;
    moduleFor('controller:assessment/index', 'Assessment Index Controller', {
        needs: ['controller:application'],

        setup: function() {
            controller = this.subject();
            createdAt = moment();
            assessment = Ember.Object.create({
                score: 1,
                notes: 'some notes',
                createdAtMoment: createdAt
            });

            model = Ember.Object.create({
                assessment: assessment
            });

            user = Ember.Object.create({
                id: 1,
                name: 'Bob'
            });

            assessor = Ember.Object.create({
                id: 1,
                name: 'Bob'
            });

            controller.set('model', model);
            controller.set('createdAtMoment', createdAt);
            controller.set('user', user);
            controller.set('assessor', assessor);
        }
    });

    test('createdAtRecently is true for assessment created one minute ago', function() {
        createdAt = createdAt.minutes(-1);
        equal(controller.get('assessmentCreatedRecently'), true);
    });

    test('createdAtRecently is false for assessment created yesterday', function() {
        createdAt = createdAt.days(-1);
        equal(controller.get('assessmentCreatedRecently'), false);
    });

    test('ownAssessment is true when user and assessor have the same id', function() {
        equal(controller.get('ownAssessment'), true);
    });

    test('ownAssessment is false when user and assessor have different ids', function() {
        assessor.id = 5;
        equal(controller.get('ownAssessment'), false);
    });

    test('canEdit is true when user and assessor have the same id and assessment was created recently', function() {
        createdAt = createdAt.minutes(-1);
        equal(controller.get('canEdit'), true);
    });

    test('canEdit is false when user and assessor have the same id and assessment was not created recently', function() {
        createdAt = createdAt.days(-1);
        equal(controller.get('canEdit'), false);
    });

    test('canEdit is false when user and assessor do not have the same id and assessment was created recently', function() {
        createdAt = createdAt.minutes(-1);
        assessor.id = 5;
        equal(controller.get('canEdit'), false);
    });
  });
;define("code-test-bot-app/tests/unit/controllers/assessments/assessments-new-controller-test", 
  ["code-test-bot-app/tests/helpers/test-for","code-test-bot-app/tests/helpers/utils"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var testFor = __dependency1__["default"];
    var randomElement = __dependency2__.randomElement;

    describe('Assessments New Controller', testFor('controller:assessments/new', function() {
        var controller;
        var model, assessment;

        before(function() {
            controller = this.subject();

            assessment = Ember.Object.create({
                score: 1,
                notes: 'some notes'
            });

            controller.set('model', assessment);
        });

        describe('#isFormIncomplete', function() {
            context('when all fields filled', function() {
                it('is false', function() {
                    expect(controller.get('isFormIncomplete')).to.be.false();
                });
            });

            context('when any field empty', function() {
                before(function() {
                    var fields = ['score', 'notes'];
                    assessment.set(randomElement(fields), null);
                });

                it('is true', function() {
                    expect(controller.get('isFormIncomplete')).to.be.true();
                });
            });
        });
    }));
  });
;define("code-test-bot-app/tests/unit/controllers/auth/auth-login-controller-test", 
  ["ember-qunit","code-test-bot-app/lib/window-location-helper","code-test-bot-app/tests/helpers/test-for"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleFor = __dependency1__.moduleFor;
    var WindowLocationHelper = __dependency2__["default"];
    var testFor = __dependency3__["default"];

    describe('Auth Login Controller', testFor('controller:auth/login', function() {
        describe('login action', function() {
            it('redirects to the auth_uri from the model', function() {
                var uri = '/a/url';
                var model = Ember.Object.create({ auth_uri: uri });
                var controller = this.subject();

                Ember.run(function() {
                    controller.set('model', model);
                    controller.send('login');
                });

                expect(WindowLocationHelper.setLocation.calledWith(uri)).to.be.true();
            });
        });
    }));
  });
;define("code-test-bot-app/tests/unit/controllers/submissions/submissions-new-controller-test", 
  ["ember-qunit","code-test-bot-app/tests/helpers/utils"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;
    var randomElement = __dependency2__.randomElement;

    var controller, submission, model;
    moduleFor('controller:submissions/new', 'Submissions New Controller', {
        setup: function() {
            controller = this.subject();
            submission = Ember.Object.create({emailText: 'text', zipfile: 'file', save: function(){}});
            model = Ember.Object.create({
                submission: submission
            });
            controller.set('model', model);
            controller.set('candidateName', 'Bob');
            controller.set('candidateEmail', 'bob@example.com');
        }
    });

    test('isFormIncomplete is false when all fields are filled', function() {
        equal(controller.get('isFormIncomplete'), false);
    });

    test('isFormIncomplete is true when any field is empty', function() {
        var fields = ['submission.emailText', 'submission.zipfile', 'candidateName', 'candidateEmail'];
        var field = randomElement(fields);

        Ember.run(function() {
            controller.set(field, null);
        });

        equal(controller.get('isFormIncomplete'), true);
    });
  });
;define("code-test-bot-app/tests/unit/controllers/user/user-edit-controller-test", 
  ["code-test-bot-app/tests/helpers/test-for","code-test-bot-app/tests/helpers/utils","code-test-bot-app/tests/helpers/data"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    var testFor = __dependency1__["default"];
    var randomElement = __dependency2__.randomElement;
    var injectFakeStore = __dependency3__.injectFakeStore;

    describe('User Edit Controller', testFor('controller:user/edit', function() {
        var controller;
        var model, role, new_role, user, store;

        before(function() {
            controller = this.subject();
            store = injectFakeStore(controller);

            role = Ember.Object.create({
                id: 1,
                name: 'Administrator'
            });

            new_role = Ember.Object.create({
                id: 2,
                name: 'Assessor'
            });

            user = Ember.Object.create({
                id: 1,
                name: 'Bob',
                email: 'bob@bob.com',
                role: role
            });

            controller.set('content', user);
            controller.set('selectedRole', new_role);
        });

        describe('#changeRole', function() {

            context('when role is selected', function() {
                before(function() {
                    var find = sinon.stub(store, 'find');
                    find.withArgs('user').returns(user);
                    user.reopen({
                        save: sinon.spy()
                    });
                });

                it('should have updated role for user', function() {
                    equal(user.get('role'), role);
                    Ember.run(function() {
                        controller.send('changeRole');
                    });
                    equal(user.get('role'), new_role);
                    equal(user.save.callCount, 1);
                });
            });
        });
    }));
  });
;define("code-test-bot-app/tests/unit/lib/auth/www-authenticate-header-test", 
  ["code-test-bot-app/lib/auth/www-authenticate-header"],
  function(__dependency1__) {
    "use strict";
    var WWWAuthenticateHeader = __dependency1__["default"];

    describe('WWWAuthenticateHeader', function() {
        describe('::parse', function() {
            context('when given a valid xhr response', function() {
                lazy('xhr', function() {
                    return {
                        status: 401,
                        getResponseHeader: function() {
                            return 'Bearer error="invalid_token", error_description="Access Token Expired"';
                        }
                    };
                });

                it('returns a new WWWAuthenticateHeader instance', function() {
                    var result = WWWAuthenticateHeader.parse(this.xhr);

                    expect(result).to.be.defined();
                    expect(result instanceof WWWAuthenticateHeader).to.be.true();
                });
            });
        });

        context('when empty', function() {
            lazy('header', function() {
                return WWWAuthenticateHeader.parse({
                    status: 401,
                    getResponseHeader: function() {
                        return 'Bearer';
                    }
                });
            });

            describe('#isEmpty', function() {
                it('is true', function() {
                    expect(this.header.get('isEmpty')).to.be.true();
                });
            });

            describe('#isInvalidToken', function() {
                it('is false', function() {
                    expect(this.header.get('isInvalidToken')).to.be.false();
                });
            });
        });

        context('when error="invalid_token"', function() {
            lazy('header', function() {
                return WWWAuthenticateHeader.parse({
                    status: 401,
                    getResponseHeader: function() {
                        return 'Bearer error="invalid_token", error_description="Access Token Expired"';
                    }
                });
            });

            describe('#isEmpty', function() {
                it('is false', function() {
                    expect(this.header.get('isEmpty')).to.be.false();
                });
            });

            describe('#isInvalidToken', function() {
                it('is true', function() {
                    expect(this.header.get('isInvalidToken')).to.be.true();
                });
            });
        });
    });
  });
;define("code-test-bot-app/tests/unit/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator-test", 
  ["ember-qunit","code-test-bot-app/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var test = __dependency1__.test;
    module('OutOfBandTokenAuthenticator');

    var OutOfBandTokenAuthenticator = Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator;

    test('restore: returns a promise that rejects if the access_token is empty', function() {
        expect(2);

        var badData1 = { };
        var badData2 = { access_token: '' };
        var authenticator = OutOfBandTokenAuthenticator.create();

        Ember.run(function() {
            authenticator.restore(badData1).then(null, function() {
                ok(true);
            });
            authenticator.restore(badData2).then(null, function() {
                ok(true);
            });
        });
    });

    test('restore: returns a promise that rejects if the access token is expired', function() {
        expect(1);

        var now = (new Date()).getTime();
        var expiredToken = { access_token: 'token', expires_at: now - 100 };
        var authenticator = OutOfBandTokenAuthenticator.create();

        Ember.run(function() {
            authenticator.restore(expiredToken).then(null, function() {
                ok(true);
            });
        });
    });

    test('restore: returns a promise that resolves if the access token exists and is not expired', function() {
        var now = (new Date()).getTime();
        var goodToken = { access_token: 'token', expires_at: now + 100 };
        var authenticator = OutOfBandTokenAuthenticator.create();

        Ember.run(function() {
            authenticator.restore(goodToken).then(function(result) {
                deepEqual(result, goodToken);
            }, null);
        });
    });

    test('authenticate: returns a promise that resolves with the expires_at value normalized to milliseconds', function() {
        var token = { access_token: 'token', expires_at: 5, expires: 'true' };
        var authenticator = OutOfBandTokenAuthenticator.create();

        Ember.run(function() {
            authenticator.authenticate(token).then(function(result) {
                deepEqual(result, { access_token: 'token', expires_at: 5000, expires: true });
            });
        });
    });
  });
;define("code-test-bot-app/tests/unit/lib/stores/ephemeral-test", 
  ["ember-qunit","code-test-bot-app/lib/stores/ephemeral"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var test = __dependency1__.test;
    var EphemeralStore = __dependency2__["default"];

    var testKey = 'test';

    describe('EphemeralStore', function() {
        var store;
        before(function() {
            store = EphemeralStore.create();
        });

        describe('#getItem', function() {
            it('gets a saved value', function() {
                var data = {};
                data[testKey] = 'val';
                store.set('data', data);

                expect(store.getItem(testKey)).to.equal('val');
            });
        });

        describe('#setItem', function() {
            it('saves a value', function() {
                store.setItem(testKey, 'val');

                expect(store.getItem(testKey)).to.equal('val');
            });
        });

        describe('#removeItem', function() {
            it('removes a saved value', function() {
                store.setItem(testKey, 'val');
                store.removeItem(testKey);

                expect(store.getItem(testKey)).to.equal(undefined);
            });
        });
    });
  });
;define("code-test-bot-app/tests/unit/lib/stores/local-test", 
  ["ember-qunit","code-test-bot-app/lib/stores/local"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    /* globals localStorage */

    var test = __dependency1__.test;
    var LocalStore = __dependency2__["default"];

    var testKey = 'test';
    describe('LocalStore', function() {
        var store;
        before(function() {
            store = LocalStore.create();
        });

        after(function() {
            localStorage.removeItem(testKey);
        });

        describe('#getItem', function() {
            it('gets a value from localStorage', function() {
                localStorage.setItem(testKey, 'val');

                expect(store.getItem(testKey)).to.equal('val');
            });
        });

        describe('#setItem', function() {
            it('saves a value to localStorage', function() {
                store.setItem(testKey, 'val');

                expect(localStorage.getItem(testKey)).to.equal('val');
            });
        });

        describe('#removeItem', function() {
            it('removes a value from localStorage', function() {
                store.setItem(testKey, 'val');
                store.removeItem(testKey);
                expect(store.getItem(testKey)).to.equal(null);
            });
        });
    });
  });
;define("code-test-bot-app/tests/unit/mixins/auto-saveable-test", 
  ["code-test-bot-app/mixins/auto-saveable"],
  function(__dependency1__) {
    "use strict";
    var AutoSaveable = __dependency1__["default"];

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
  });
;define("code-test-bot-app/tests/unit/routes/auth/auth-login-route-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleFor = __dependency1__.moduleFor;

    moduleFor('route:auth/login', 'Auth Login Route');

    test('model queries the new session URI for the auth_uri', function() {
        var route = this.subject();

        var expected = {auth_uri: 'testing_uri'};

        Ember.run(function() {
            route.model().then(function(result) {
                deepEqual(result, expected);
            });
        });
    });
  });
;define("code-test-bot-app/tests/unit/routes/submissions/submissions-index-route-test", 
  ["ember-qunit","code-test-bot-app/tests/helpers/data"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleFor = __dependency1__.moduleFor;
    var injectFakeStore = __dependency2__.injectFakeStore;

    moduleFor('route:submissions/index', 'Submissions Index Route');

    test('model is a list of submissions', function() {
        var expectedSubmissions = 'expectedSubmissions';

        var route = this.subject();
        var store = injectFakeStore(route);
        sinon.stub(store, 'find').withArgs('submission').returns(expectedSubmissions);

        Ember.run(function() {
            var model = route.model();

            equal(model, expectedSubmissions);
        });
    });
  });
;define("code-test-bot-app/tests/unit/routes/submissions/submissions-new-route-test", 
  ["ember-qunit","code-test-bot-app/tests/helpers/data"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleFor = __dependency1__.moduleFor;
    var injectFakeStore = __dependency2__.injectFakeStore;

    moduleFor('route:submissions/new', 'Submissions New Route');

    test('sets up the model with a new submission record, candidates, and languages', function() {
        var expectedSubmission = 'expectedSubmission';
        var expectedLevels = 'expectedLevels';
        var expectedLanguages = 'expectedLanguages';

        var route = this.subject();
        var store = injectFakeStore(route);

        var find = sinon.stub(store, 'find');
        find.withArgs('level').returns(expectedLevels);
        find.withArgs('language').returns(expectedLanguages);

        sinon.stub(store, 'createRecord').returns(expectedSubmission);

        Ember.run(function() {
            var model = route.model();

            equal(model.get('submission'), expectedSubmission);
            equal(model.get('levels'), expectedLevels);
            equal(model.get('languages'), expectedLanguages);
        });
    });
  });
;define("code-test-bot-app/tests/unit/utils/math-test", 
  ["code-test-bot-app/utils/math"],
  function(__dependency1__) {
    "use strict";
    var cumulativeMovingAverage = __dependency1__.cumulativeMovingAverage;
    var roundToNearestHalf = __dependency1__.roundToNearestHalf;

    describe('Math Utils', function() {
        describe('cumulativeMovingAverage', function() {
            it('calculates a new average for an added item', function() {
                // avg([2,2]) == 2; avg([2,2,5]) == 3;
                expect(cumulativeMovingAverage(2, 5, 2)).to.equal(3);
            });

            it('calculates a new average for a removed item', function() {
                expect(cumulativeMovingAverage(3, 5, 3, true)).to.equal(2);
            });
        });

        describe('roundToNearestHalf', function() {
            it('does not change ints', function() {
                expect(roundToNearestHalf(1)).to.equal(1);
            });

            it('does not change numbers already at x.5', function() {
                expect(roundToNearestHalf(2.5)).to.equal(2.5);
            });

            it('rounds decimals to nearest half', function() {
                expect(roundToNearestHalf(2.1)).to.equal(2);
                expect(roundToNearestHalf(2.3)).to.equal(2.5);
                expect(roundToNearestHalf(2.6)).to.equal(2.5);
                expect(roundToNearestHalf(2.8)).to.equal(3);
            });
        });
    });
  });
;define("code-test-bot-app/views/candidates/index", 
  ["code-test-bot-app/views/foundation","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var FoundationView = __dependency1__["default"];

    __exports__["default"] = FoundationView.extend();
  });
;define("code-test-bot-app/views/foundation", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.View.extend({
        didInsertElement: function() {
            $(document).foundation();
            this._super();
        }
    });
  });
;define("code-test-bot-app/views/file-upload", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* globals FileReader */

    __exports__["default"] = Ember.TextField.extend({
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
  });
;define("code-test-bot-app/views/menu", 
  ["code-test-bot-app/views/foundation","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var FoundationView = __dependency1__["default"];

    __exports__["default"] = FoundationView.extend();
  });
;define("code-test-bot-app/views/saving-indicator", 
  ["exports"],
  function(__exports__) {
    "use strict";

    __exports__["default"] = Ember.View.extend({
        templateName: 'saving-indicator',
        message: '',
        spinner: null,

        didInsertElement: function() {
            this.$().hide();
            this.set('spinner', this.$('.fa-spinner'));
        },

        onSaveStatusChange: function() {
            if (this.get('controller.isSaving')) {
                this.set('message', 'Saving...');
                this.spinner.show();
                this.$().show();
            } else {
                this.set('message', 'Changes saved.');
                this.spinner.hide();
                if (this.$().is(':visible')) {
                    Ember.run.later(this.$(), function() {
                        if (this) {
                            this.fadeOut('slow');
                        }
                    }, 2000);
                }
            }
        }.observes('controller.isSaving')
    });
  });
;define("code-test-bot-app/views/secured/edit", 
  ["code-test-bot-app/views/foundation","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var FoundationView = __dependency1__["default"];

    __exports__["default"] = FoundationView.extend();
  });
;define("code-test-bot-app/views/submission/action-menu", 
  ["code-test-bot-app/router","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Router = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({
        templateName: 'submission/action-menu',

        dropdownId: function() {
            return 'drop-menu-' + this.elementId;
        }.property(),

        mainLink: function() {
            // Can't just use link-to helper because it will preempt click handling from Foundation
            // (i.e. it will just redirect to the route instead of dropping down the menu)
            return Router.router.generate('submission.index', this.get('context'));
        }.property('context')
    });
  });
;define("code-test-bot-app/views/submissions/index", 
  ["code-test-bot-app/views/foundation","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var FoundationView = __dependency1__["default"];

    __exports__["default"] = FoundationView.extend();
  });