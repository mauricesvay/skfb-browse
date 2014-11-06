'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var FiltersView = Backbone.View.extend({

    events: {
        'click .btn': 'select'
    },

    initialize: function(options) {
        this.model = options.model;
        this.prop = options.prop;
        this.listenTo(this.model, 'change:' + options.prop, this.propChanged.bind(this));
        this.propChanged();
    },

    select: function(e) {
        var target = $(e.currentTarget);
        var value = target.val();
        this.model.set(this.prop, value);
    },

    propChanged: function(model) {
        this.$('.active').removeClass('active');
        this.$('[value="' + this.model.get(this.prop) + '"]').addClass('active');
    }
});

module.exports = FiltersView;
