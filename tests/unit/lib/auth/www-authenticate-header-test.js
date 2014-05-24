import WWWAuthenticateHeader from 'code-test-bot-app/lib/auth/www-authenticate-header';

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
