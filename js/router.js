'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var Router = Backbone.Router.extend({

    routes: {
        '' : 'homepage',
        'popular': 'popular',
        'staffpicks': 'staffpicks',
        'recent': 'recent',
        'cat/:category': 'category',
        'likes/:uid': 'likes',
    },

    initialize: function( options ) {
        this.appView = options.appView;
    },

    homepage: function() {
        this.appView.goTo('homepage');
    },

    popular: function() {
        this.appView.goTo('popular');
    },

    staffpicks: function() {
        this.appView.goTo('staffpicks');
    },

    recent: function() {
        this.appView.goTo('recent');
    },

    category: function( id ) {
        this.appView.goTo('category', id );
    },

    likes: function( uid ) {
        this.appView.goTo('likes', uid );
    }
});

module.exports = Router;
