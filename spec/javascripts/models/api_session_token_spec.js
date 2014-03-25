//= require spec_helper

describe('ApiSessionToken', function () {
    var apiSessionToken;

    beforeEach(function () {
        apiSessionToken = CodeTestBotApp.ApiSessionToken.create();
    });

    describe('hasToken false if', function () {
        it('token is falsy', function () {
            apiSessionToken.set('token', undefined);
            expect(apiSessionToken.get('hasToken')).to.be.false;

            apiSessionToken.set('token', null);
            expect(apiSessionToken.get('hasToken')).to.be.false;
        });

        it('token is not a string', function () {
            apiSessionToken.set('token', 1234);
            expect(apiSessionToken.get('hasToken')).to.be.false;

            apiSessionToken.set('token', {});
            expect(apiSessionToken.get('hasToken')).to.be.false;
        });

        it('token string is empty', function () {
            apiSessionToken.set('token', '');
            expect(apiSessionToken.get('hasToken')).to.be.false;
        });
    });

    describe('hasToken true if', function () {
        it('token is non-empty string', function () {
            apiSessionToken.set('token', '1234');
            expect(apiSessionToken.get('hasToken')).to.be.true;
        });
    });

    describe('acquire', function () {
        describe('promise', function () {
            before(function () {
                this.server = sinon.fakeServer.create();
            });

            after(function () {
                this.server.restore();
            });

            it('resolves with token if session established', function (done) {
                var response = {
                    api_session_token: {
                        token: '1234',
                        ttl: 20
                    }
                };
                this.server.respondWith('POST', 'http://localhost:3000/sessions',
                    [200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]);

                var promise = CodeTestBotApp.ApiSessionToken.acquire(null, testing().dataStore());
                this.server.respond();

                promise.then(function (token) {
                    expect(token.get('token')).to.equal(response.api_session_token.token);
                    expect(token.get('ttl')).to.equal(response.api_session_token.ttl);
                }).then(done, done);
            });

            it('resolves with auth_url if needs login', function (done) {
                this.server.respondWith('POST', 'http://localhost:3000/sessions',
                    [200, { 'Content-Type': 'application/json' }, '{"auth_url":"/test"}']);

                var promise = CodeTestBotApp.ApiSessionToken.acquire(null, testing().dataStore());
                this.server.respond();

                expectedResult = { reason: 'expired', auth_url: '/test'};
                expect(promise).to.eventually.deep.equal(expectedResult).and.notify(done);
            });

            it('rejects if ajax fails', function (done) {
                this.server.respondWith('POST', 'http://localhost:3000/sessions',
                    [500, {}, 'OMG the server is on fire']);

                var promise = CodeTestBotApp.ApiSessionToken.acquire(null, testing().dataStore());
                this.server.respond();

                expect(promise).to.be.rejectedWith('error: Internal Server Error').and.notify(done);
            });
        });

        describe('POST', function () {
            beforeEach(function () {
                this.xhr = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                this.xhr.onCreate = function (xhr) {
                    requests.push(xhr);
                };
            });

            afterEach(function () {
                this.xhr.restore();
                var getItem = testing().dataStore().getItem;
                if (getItem.restore) {
                    getItem.restore();
                }
            });

            it('sends the URL to return to after authentication', function () {
                CodeTestBotApp.ApiSessionToken.acquire(null, testing().dataStore());

                expect(this.requests[0].method).to.equal('POST');
                expect(this.requests[0].requestBody).to.contain('return_to=' + encodeURIComponent('http://localhost:3001/auth/complete'));
            });

            it('creates a new token if one does not already exist', function () {
                sinon.stub(Math, 'uuid').returns('fake_token');

                var dataStore = testing().dataStore();
                sinon.stub(dataStore, 'getItem').returns(null);

                CodeTestBotApp.ApiSessionToken.acquire(null, dataStore);

                expect(this.requests[0].method).to.equal('POST');
                expect(this.requests[0].requestBody).to.contain('token=fake_token')
            });

            it('uses the token in the application dataStore if it exists', function () {
                var dataStore = testing().dataStore();
                sinon.stub(dataStore, 'getItem').returns('existing_token');

                CodeTestBotApp.ApiSessionToken.acquire(null, dataStore);

                expect(this.requests[0].method).to.equal('POST');
                expect(this.requests[0].requestBody).to.contain('token=existing_token')
            });
        });
    });
});
