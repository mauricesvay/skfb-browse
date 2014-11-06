'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var tplHomepage = require('../templates/homepage.tpl');
var Homepage = require('./Homepage');
var ModelsView = require('./Models');
var Sidebar = require('./Sidebar');
var FiltersView = require('./Filters');

var AppView = Backbone.View.extend({

    el: $('body'),

    events: {
        'submit #search': 'search'
    },

    initialize: function() {
        this.currentView = null;
        this.sortBy = null;

        this.browseModel = new Backbone.Model({
            page: 'recent',
            filters: null,
            sortBy: '-createdAt',
        });

        var filters = new FiltersView({
            el: this.$('.filters'),
            model: this.browseModel,
            prop: 'sortBy'
        });

        this.listenTo(this.browseModel, 'change:sortBy', function( model ){
            if ( model.get('sortBy') === '-viewCount' || model.get('sortBy') === '-likeCount') {
                this.browseModel.set('date_filter', 31);
            } else {
                this.browseModel.set('date_filter', '');
            }
            this.goTo(this.currentPage, this.params);
        }.bind(this));

        var sidebar = new Sidebar({
            el: $('.sidebar')
        })
    },

    search: function(e) {

        e.preventDefault();

        this.goTo('search', $.trim(this.$('.search-field').val()));
        this.$('.search-field').val('');
        this.router.navigate("search", {
            trigger: false
        });

    },

    enableFilters: function() {
        this.$('.filters').show();
    },

    disableFilters: function() {
        this.$('.filters').hide();
    },

    goTo: function(page, params) {

        if (this.currentView) {
            this.currentView.undelegateEvents();
            this.currentView.remove();
        }

        var options;
        switch (page) {

            case 'homepage':
                this.disableFilters();
                this.currentView = new Homepage();
                break;

            case 'staffpicks':
                this.disableFilters();
                options = {
                    'flag_filter': 'staffpicked'
                }
                console.log(options);
                this.currentView = new ModelsView({
                    options: options
                });
                break;
            case 'popular':
                this.disableFilters();
                options = {
                    'date_filter': 7,
                    'sort_by': '-viewCount'
                }
                this.currentView = new ModelsView({
                    options: options
                });
                break;
            case 'recent':
                this.enableFilters();
                options = {
                    'sort_by': this.browseModel.get('sortBy'),
                    'date_filter': this.browseModel.get('date_filter')
                };
                this.currentView = new ModelsView({
                    options: options
                });
                break;
            case 'category':
                this.enableFilters();
                options = {
                    'categories_filter': params,
                    'sort_by': this.browseModel.get('sortBy'),
                    'date_filter': this.browseModel.get('date_filter')
                };
                this.currentView = new ModelsView({
                    options: options
                });
                break;
            case 'search':
                this.enableFilters();
                options = {
                    'search': params,
                    'sort_by': this.browseModel.get('sortBy'),
                    'date_filter': this.browseModel.get('date_filter')
                };
                this.currentView = new ModelsView({
                    options: options
                });
                break;
            default:
                break;
        }

        this.currentPage = page;
        this.params = params;

        this.$('.content').append(this.currentView.el);
    }
});

module.exports = AppView;
