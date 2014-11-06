var $ = require('jquery');
var Backbone = require('backbone');

var Model = Backbone.Model.extend({

    getFallback: function(callback) {

        var url = 'https://sketchfab.com/i/models/' + this.get('uid') + '/fallback';

        localforage.getItem(url).then(function(cached) {
            if (cached) {
                callback && callback(cached);
            } else {
                $.ajax({
                    url: url,
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    success: function(data) {
                        if (data && data.results && data.results.images) {
                            localforage.setItem(url, data.results.images);
                            callback(data.results.images);
                        }
                    },
                    error: function() {
                        callback([]);
                    }
                });
            }
        });
    }
});

module.exports = Model;
