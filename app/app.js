import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import BreadcrumbsTemplate from 'code-test-bot-app/templates/breadcrumbs';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: 'code-test-bot-app', // TODO: loaded via config
  Resolver: Resolver
});

loadInitializers(App, 'code-test-bot-app');

// TODO: find a better place to put this
BreadCrumbs.BreadCrumbsComponent.reopen({
  tagName: 'ol',
  classNames: ['breadcrumb'],
  layout: BreadcrumbsTemplate
});

export default App;
