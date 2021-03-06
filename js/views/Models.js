'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Steady = require('steady');
var React = require('react');

var Models = require('../collections/Models');
var Grid = require('../components/Grid.jsx');

var AppView = Backbone.View.extend({

    tagName: 'div',

    initialize: function( options ) {
        this.options = options.options;
        this.parentView = options.parent;
        this.model = new Backbone.Model();
        this.load();
        this.$el.empty();
        this.$el.html('<div style="text-align:center;padding-top: 200px;"><img src="assets/img/loading.gif" alt="" style=""></div>');
        this.$el.scrollTop(0);
        this.fallbackTimer = null;

        this.s = new Steady({
            throttle: 100,
            conditions: {
                'min-top': 300,
                'max-bottom': 200
            },
            handler: this.loadMore.bind(this),
            scrollElement: $('.content').get(0)
        });
    },

    load: function() {
        var self = this;
        this.model = new Models([], this.options);
        this.model.fetch({
            success: function() {
                self.render();
                self.model.prefetch();
            }
        });
    },

    startLoading: function() {
        this.$el.addClass('loading');
    },

    endLoading: function() {
        this.$el.removeClass('loading');
    },

    loadMore: function(values, done) {
        var self = this;
        this.startLoading();
        this.model.loadMore( {
            success: function() {
                done && done();
                self.endLoading();
                self.render();
                self.model.prefetch();
            }
        } );
    },

    cancelFallback: function() {
        if ( this.fallbackTimer ) {
            clearTimeout( this.fallbackTimer );
        }
    },

    render: function() {
        var data = this.model.toJSON();
        React.render(
            React.createElement(
                Grid, {
                    models: data,
                    mouseOverHandler: this.onMouseOver.bind(this),
                    loadMoreHandler: this.loadMore.bind(this),
                    clickHandler: this.onClick.bind(this)
                }
            ),
            this.el
        );
        return this;
    },

    onMouseOver: function( e ) {
        var uid = e.currentTarget.getAttribute('data-uid');
        var model = this.model.where({ uid: uid });

        if ( model.length && !model[0].get('fallback') ) {
            this.cancelFallback();
            this.fallbackTimer = setTimeout(function(){
                model[0].getFallback(function( images ){
                    if( images && images.length ) {
                        var image = images[ images.length - 1 ];
                        model[0].set('fallback', image);
                        this.render();
                    }
                }.bind(this));
            }.bind(this), 2000);
        }
    },

    onClick: function( e ) {
        e.preventDefault();
        var uid = e.currentTarget.getAttribute('data-uid');
        this.parentView.router.navigate("model/" + uid, {trigger: true});
    },

    remove: function() {
        this.s.stop();
        React.unmountComponentAtNode(this.el);
        Backbone.View.prototype.remove.apply(this, arguments);
    }
});

module.exports = AppView;
