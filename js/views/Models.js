'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Steady = require('steady');

var Models = require('../collections/Models');
var tplGrid = require('../templates/grid.tpl');

var AppView = Backbone.View.extend({

    tpl: _.template(tplGrid),

    tagName: 'div',

    events: {
        'click .loadmore': 'loadMore',
        'mouseover .modelcard-preview': 'loadFallback',
        'mouseout .modelcard-preview': 'cancelFallback'
    },

    initialize: function( options ) {
        this.options = options.options;
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
            }
        } );
    },

    //@TODO: move to subview for model
    loadFallback: function( e ) {
        var $target = $( e.currentTarget );

        if ( $target.find('.fallback-image').length ) {
            return;
        }

        var uid = $target.parents('.modelcard').attr('data-uid');
        var model = this.model.where({ uid: uid });
        if ( model.length ) {
            this.cancelFallback();
            this.fallbackTimer = setTimeout(function(){
                model[0].getFallback(function( images ){
                    if( images && images.length ) {
                        var image = images[ images.length - 1 ];
                        var w = image.width / 15;
                        var h = image.height;
                        var div = $('<div/>');
                        div.addClass('fallback-image')
                        div.css({
                            'background-image': 'url(' + image.url + ')'
                        });
                        $target.find('.fallback-container').append( div );
                    }
                });
            }, 2000);
        }
    },

    cancelFallback: function() {
        if ( this.fallbackTimer ) {
            clearTimeout( this.fallbackTimer );
        }
    },

    render: function() {
        var data = this.model.toJSON();

        // Populate previews
        var images;
        for (var i=0; i<data.length; i++) {
            images = data[i].thumbnails.images;
            for (var j=0; j<images.length; j++) {
                data[i].preview = images[j].url;
                if ( images[j].width > 400 ) {
                    break;
                }
            }
        }

        var html = this.tpl( { models : data } );
        this.$el.html( html );
        return this;
    },

    remove: function() {
        this.s.stop();
        Backbone.View.prototype.remove.apply(this, arguments);
    }
});

module.exports = AppView;
