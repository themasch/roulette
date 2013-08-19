var ghxhr_jq = (function($) {
    var nop = function() {};
    return {
        /**
         * sig: (string url, [object data], [fn success], [fn error])
         */
        getJSON: function(url, data, success, error) {
            if(typeof data === 'function') {
                // data not given
                error = success;
                success = data;
                data = undefined;
            }
            var ops = {
                type: 'GET',
                dataType: 'json',
                url: url,
                data: data,
                success: success || nop,
                error: error || console.error.bind(console)
            };

            $.ajax(ops)
        }
    }
});

github = (function(xhr) {
    var config = {
        apiBase: 'https://api.github.com',
        cache: localStorage,
        cachePrefix: 'gh:'
    };
    var user = {
        request: function(path, cachekey, success, error) {
            cachekey = config.cachePrefix + cachekey;
            var cacheval = config.cache.getItem(cachekey);
            if(cacheval) {
                setTimeout(success.bind(this, JSON.parse(cacheval)), 0);
            } else {
                xhr.getJSON(
                    config.apiBase + path,
                    function(data) {
                        config.cache.setItem(cachekey, JSON.stringify(data));
                        success(data)
                    },
                    error
                )
            }
            return this;
        },
        getInfo: function(success, error) {
            return this.request(
                '/users/' + this.name,
                'userinfo:' + this.name,
                success,
                 error
            );
        },
        getOrgs: function(success, error) {
            return this.request(
                '/users/' + this.name + '/orgs',
                'orgs:' + this.name,
                success,
                 error
            );
        },
        getRepos: function(success, error) {
            return this.request(
                '/users/' + this.name + '/repos',
                'repos:' + this.name,
                success,
                error
            );
        }
    }
    var gh = {
        set: function(key, value) {
            config[key] = value;
            return gh;
        },
        get: function(key) {
            return config[key]
        },
        user: function(name) {
            var u = Object.create(user);
            u.name = name;
            return u;
        }
    };

    return gh;
})(ghxhr_jq(jQuery || Zepto));
