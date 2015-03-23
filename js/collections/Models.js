'use strict';

var $ = require('jquery');
var _ = require('underscore');
var localforage = require('localforage');
var Backbone = require('backbone');
Backbone.$ = $;

var Model = require('../models/Model');

// $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
//     var url;
//     if ( originalOptions.data ) {
//         url = originalOptions.url + '?' + $.param(originalOptions.data);
//     } else {
//         url = originalOptions.url
//     }
//     if (options.crossDomain) {
//         options.url = "http://www.inertie.org/ba-simple-proxy.php?mode=native&url=" + encodeURIComponent(url);
//         options.crossDomain = false;
//     }
// });

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
        var prop;
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

    loadMore: function(options) {
        if (this.params['offset']) {
            this.params['offset'] += this.params['count'];
        } else {
            this.params['offset'] = this.params['count'];
        }
        this.fetch(_.extend(options, {
            reset: false,
            remove: false
        }));
    },

    prefetch: function() {
        var prefetchParams = _.clone(this.params);
        if (prefetchParams['offset']) {
            prefetchParams['offset'] += prefetchParams['count'];
        } else {
            prefetchParams['offset'] = prefetchParams['count'];
        }
        var key = this.url + '?' + $.param(prefetchParams);
        console.log('Prefetch ' + key);
        this._fetch(this.url, prefetchParams, key);
    },

    sync: function(method, model, options) {

        if (method === 'read') {

            var key = this.url + '?' + $.param(this.params);
            var ttl = 10 * 60 * 1000;

            localforage.getItem(key).then(function(cached) {
                if (cached && (Date.now() - cached.date < ttl)) {
                    console.info('Cache hit ' + key);
                    setTimeout(function() {
                        options.success && options.success(cached.data);
                    }, 1);
                } else {
                    console.warn('Cache miss ' + key);
                    this._fetch(this.url, this.params, key)
                        .done(function(data, status, xhr) {
                            options.success && options.success(data.results);
                        })
                        .fail(function(xhr, status, error) {
                            console.log('Error while fetching data');
                        });
                }
            }.bind(this));

        }
    },

    _fetch: function(url, params, cacheKey) {
        var deferred = $.ajax({
            'url': url,
            'data': params,
            'dataType': 'json',
            'crossDomain': true
        });

        if (cacheKey) {
            deferred.done(function(data, status, xhr) {
                console.info('Caching ' + cacheKey);
                localforage.setItem(cacheKey, {
                    date: Date.now(),
                    data: data.results
                });
            });
        }

        return deferred;
    }
});

module.exports = Models;
