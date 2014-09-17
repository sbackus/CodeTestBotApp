// Inlined and modified from https://raw.githubusercontent.com/chrisfarber/ember-breadcrumbs/master/dist/ember-breadcrumbs.js
// This is hopefully temporary until I can figure out how to do this the right way.
// The production build of Ember does not provide the handlebars compiler which the vendor version depends on.
(function() {
  window.BreadCrumbs = Ember.Namespace.create();

  Ember.onLoad("Ember.Application", function(App) {
    return App.initializer({
      name: "ember-breadcrumbs",
      initialize: function(container, app) {
        app.register("component:bread-crumbs", BreadCrumbs.BreadCrumbsComponent);
        app.inject("component:bread-crumbs", "router", "router:main");
        return app.inject("component:bread-crumbs", "applicationController", "controller:application");
      }
    });
  });

}).call(this);

(function() {
  BreadCrumbs.BreadCrumbsComponent = Ember.Component.extend({
    tagName: "ol",
    classNames: ["breadcrumb"],
    layout: null,
    router: null,
    applicationController: null,
    handlerInfos: (function() {
      var handlerInfos;
      return handlerInfos = this.get("router").router.currentHandlerInfos;
    }).property("applicationController.currentPath"),
    pathNames: (function() {
      return this.get("handlerInfos").map(function(handlerInfo) {
        return handlerInfo.name;
      });
    }).property("handlerInfos.[]"),
    controllers: (function() {
      return this.get("handlerInfos").map(function(handlerInfo) {
        return handlerInfo.handler.controller;
      });
    }).property("handlerInfos.[]"),
    breadCrumbs: (function() {
      var breadCrumbs, controllers, deepestCrumb, defaultPaths;
      controllers = this.get("controllers");
      defaultPaths = this.get("pathNames");
      breadCrumbs = [];
      controllers.forEach(function(controller, index) {
        var crumbName, defaultPath, specifiedPath;
        crumbName = controller.get("breadCrumb");
        if (!Ember.isEmpty(crumbName)) {
          defaultPath = defaultPaths[index];
          specifiedPath = controller.get("breadCrumbPath");
          return breadCrumbs.addObject({
            name: crumbName,
            path: specifiedPath || defaultPath,
            linkable: specifiedPath !== false,
            isCurrent: false
          });
        }
      });
      deepestCrumb = breadCrumbs.get("lastObject");
      if (deepestCrumb) {
        deepestCrumb.isCurrent = true;
      }
      return breadCrumbs;
    }).property("controllers.@each.breadCrumb", "controllers.@each.breadCrumbPath", "pathNames.[]")
  });

}).call(this);
