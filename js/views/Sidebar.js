'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var AppView = Backbone.View.extend({

    events: {
        'click .item': 'select'
    },

    select: function( e ) {
        var target = $( e.currentTarget );
        this.$('.active').removeClass('active');
        target.addClass('active');
    }
});

module.exports = AppView;
