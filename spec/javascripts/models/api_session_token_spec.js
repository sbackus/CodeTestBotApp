//= require spec_helper

describe('ApiSessionToken', function () {
    var apiSessionToken;

    beforeEach(function () {
        apiSessionToken = CodeTestBotApp.ApiSessionToken.create();
    });

    describe('hasToken', function () {
        it('is false if token is falsy', function () {
            apiSessionToken.set('token', undefined);
            expect(apiSessionToken.get('hasToken')).to.be.false;

            apiSessionToken.set('token', null);
            expect(apiSessionToken.get('hasToken')).to.be.false;
        });

        it('is false if token is not a string', function () {
            apiSessionToken.set('token', 1234);
            expect(apiSessionToken.get('hasToken')).to.be.false;

            apiSessionToken.set('token', {});
            expect(apiSessionToken.get('hasToken')).to.be.false;
        });

        it('is false if token string is empty', function () {
            apiSessionToken.set('token', '');
            expect(apiSessionToken.get('hasToken')).to.be.false;
        });

        it('is true if token is non-empty string', function () {
            apiSessionToken.set('token', '1234');
            expect(apiSessionToken.get('hasToken')).to.be.true;
        });
    });

    describe('acquire', function () {
        describe('promise', function () {
            it('resolves with token if session established', function (done) {
                var response = {
                    api_session_token: {
                        token: '1234',
                        ttl: 20
                    }
                };
                fakeServer.respondWith('POST', CONFIG.SERVER_HOST + '/sessions',
                    [200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]);

                CodeTestBotApp.ApiSessionToken.acquire().then(function (result) {
                    expect(result.result).to.equal('success');
                    expect(result.token.get('token')).to.equal(response.api_session_token.token);
                    expect(result.token.get('ttl')).to.equal(response.api_session_token.ttl);
                    done();
                }, done);
            });

            it('resolves with auth_url if needs login', function (done) {
                fakeServer.respondWith('POST', CONFIG.SERVER_HOST + '/sessions',
                    [200, { 'Content-Type': 'application/json' }, '{"auth_url":"/test"}']);

                var expectedResult = { result: 'auth_required', auth_url: '/test'};

                CodeTestBotApp.ApiSessionToken.acquire().then(function(result) {
                    expect(result).to.deep.equal(expectedResult);
                    done();
                }, done);
            });

            it('rejects if ajax fails', function (done) {
                fakeServer.respondWith('POST', CONFIG.SERVER_HOST + '/sessions',
                    [500, {}, 'OMG the server is on fire']);

                CodeTestBotApp.ApiSessionToken.acquire().then(done, function(err) {
                    expect(err.message).to.equal('error: Internal Server Error');
                    done();
                });
            });
        });

        describe('POST', function () {
            var dataStore;

            beforeEach(function() {
                dataStore = testing().dataStore();
                sinon.stub(dataStore, 'getItem');
            });

            afterEach(function () {
                dataStore.getItem.restore();
            });

            it('sends the URL to return to after authentication', function () {
                CONFIG.APP_HOST = 'test_host';
                CodeTestBotApp.ApiSessionToken.acquire();

                expect(mostRecentRequest().method).to.equal('POST');
                expect(mostRecentRequest().requestBody).to.contain('return_to=' + encodeURIComponent('test_host/auth/complete'));
            });

            it('creates a new token if one does not already exist', function () {
                sinon.stub(Math, 'uuid').returns('fake_token');
                dataStore.getItem.returns(null);

                CodeTestBotApp.ApiSessionToken.acquire();

                expect(mostRecentRequest().method).to.equal('POST');
                expect(mostRecentRequest().requestBody).to.contain('token=fake_token')

                Math.uuid.restore();
            });

            it('uses the token in the application dataStore if it exists', function () {
                dataStore.getItem.returns('existing_token');

                CodeTestBotApp.ApiSessionToken.acquire();

                expect(mostRecentRequest().method).to.equal('POST');
                expect(mostRecentRequest().requestBody).to.contain('token=existing_token')
            });
        });
    });
});
