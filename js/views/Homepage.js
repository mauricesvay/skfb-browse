'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Models = require('../collections/Models');

var tplHomepage = require('../templates/homepage.tpl');

var Homepage = Backbone.View.extend({

    tpl: _.template(tplHomepage),

    initialize: function() {
        this.render();

        //Prefetch staffpicks
        var prefetch = new Models([], {
            'flag_filter': 'staffpicked'
        });
        prefetch.fetch();
    },

    render: function() {
        var html = this.tpl({});
        this.$el.html(html);
        return this;
    }
});

module.exports = Homepage;
