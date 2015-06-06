'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var tplModel = require('../templates/model.tpl');

var ModelView = Backbone.View.extend({

    tpl: _.template(tplModel),

    events: {
        'click .popup-overlay': 'close'
    },

    initialize: function(options) {
        this.options = options;
        this.render();
        $('body').append(this.$el);
    },

    render: function() {
        var html = this.tpl({
            uid: this.options.uid
        });
        this.$el.html(html);
        return this;
    },

    close: function() {
        // Restore route
        var router = this.options.parent.router;
        if (router.previousRoutes.length > 1) {
            var previousRoute = router.previousRoutes[ router.previousRoutes.length - 2 ];
            router.navigate(previousRoute.fragment, {trigger: false});
        }

        this.remove();
    }
});

module.exports = ModelView;
