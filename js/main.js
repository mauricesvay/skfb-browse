'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var Models = require('./collections/Models');
var AppView = require('./views/App');
var Router = require('./Router');

var appView = new AppView();
var router = new Router({
    appView: appView
});
appView.router = router;
Backbone.history.start();
