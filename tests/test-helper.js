import resolver from './helpers/resolver';
import { setResolver } from 'ember-qunit';

setResolver(resolver);
import WindowLocationHelper from 'code-test-bot-app/lib/window-location-helper';
sinon.stub(WindowLocationHelper, 'setLocation');

import './fixtures';
document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');
