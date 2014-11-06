var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var Model = require('../models/Model');

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    var url;
    if ( originalOptions.data ) {
        url = originalOptions.url + '?' + $.param(originalOptions.data);
    } else {
        url = originalOptions.url
    }
    if (options.crossDomain) {
        options.url = "http://www.inertie.org/ba-simple-proxy.php?mode=native&url=" + encodeURIComponent(url);
        options.crossDomain = false;
    }
});

var Models = Backbone.Collection.extend({

    model: Model,

    url: "https://sketchfab.com/v2/models",

    initialize: function(data, options) {
        var allowed = {
            'count': null,
            'offset': null,
            'search': null, // query

            'flag_filter': null, // 'staffpicked'
            'categories_filter': null, // category id
            'tags_filter': null, // tag
            'date_filter': null, // number of days
            'face_count_filter': null,
            'sort_by': '-createdAt', // '-createdAt', '-viewCount'

            'liked_by_filter': null, // user id
            'user_filter': null, // user id
            'folder_filter': null // folder id
        };
        var params = {};

        options.count = options.count || 20;

        // Get allowed params from options
        // use default values when not found
        for (prop in allowed) {
            if (_.has(options, prop)) {
                params[prop] = options[prop];
            } else {
                if (allowed[prop]) {
                    params[prop] = allowed[prop];
                }
            }
        }

        this.params = params;
    },

    loadMore: function( options ) {
        if (this.params['offset']) {
            this.params['offset'] += this.params['count'];
        } else {
            this.params['offset'] = this.params['count'];
        }
        this.fetch( _.extend(options, {
            reset: false,
            remove: false
        }));
    },

    sync: function(method, model, options) {

        if (method === 'read') {

            var key = this.url + '?' + $.param( this.params );
            var ttl = 10 * 60 * 1000;
            console.log(key);

            localforage.getItem(key).then( function(cached) {
                if ( cached && ( Date.now() - cached.date < ttl ) ) {
                    console.log('Cache hit ' + key);
                    setTimeout(function(){
                        options.success && options.success(cached.data);
                    },1);
                } else {
                    console.log('Cache miss ' + key);
                    $.ajax({
                        'url': this.url,
                        'data': this.params,
                        'dataType': 'json',
                        'crossDomain': true,
                        'success': function(data, status, xhr) {
                            localforage.setItem(key, {
                                date: Date.now(),
                                data: data.results
                            });
                            options.success && options.success(data.results);
                        },
                        'error': function(xhr, status, error) {
                            console.log('Error while fetching data');
                        }
                    });
                }
            }.bind(this));

        }
    }
});

module.exports = Models;
