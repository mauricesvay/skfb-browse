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
        'model/:uid': 'model'
    },

    initialize: function( options ) {
        this.appView = options.appView;
        this.previousRoutes = [];
        this.listenTo(this, 'route', function(name, args){
            this.previousRoutes.push({
                name : name,
                args : args,
                fragment : Backbone.history.fragment
            });
        }.bind(this));
    },

    homepage: function() {
        this.appView.goTo('homepage');
    },

    popular: function() {
        this.appView.goTo('popular');
    },

    staffpicks: function() {
        console.log('Go to staffpicks');
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
    },

    model: function( uid ) {
        this.appView.showModel( uid );
    }
});

module.exports = Router;
