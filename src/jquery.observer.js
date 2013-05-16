/**
* A Observer Model on Top of the jQuery Javascript Library
*
* Copyright 2011, Thomas Appel, http://thomas-appel.com, mail(at)thomas-appel.com
*
* dual licensed under MIT and GPL license
*
* http://dev.thomas-appel.com/licenses/mit.txt
* http://dev.thomas-appel.com/licenses/gpl.txt
*
* see readme.md for further info
*
* =================================================================
*
* @name jquery.observer.js
* @version 0.1.1
* @author thomas appel <mail@thomas-appel.com
*/

(function (global, undefined) {

    'use strict';

    var slice = Array.prototype.slice,
    Subscriber, Observer, pubsCID = 0,
    subsCID = 0,
    exports,
    isObject = function (obj) {
        return obj && obj.toString().toLowerCase() === '[object object]';
    },
    $ = (typeof require !== 'undefined' || (global.define && global.define.amd)) ? require('jquery') : global.jQuery;

    /**
     * @param {Mixed} options: String or Obejct
     * @param {Object} methods: optional
     */
    function Publisher(options, methods) {
        var that = this,
        i, sl, s;

        methods = methods || {};

        if (typeof options === 'string') {
            options = {
                name: options
            };
        }

        options = $.extend({},
        Publisher.defaults, options);
        this.subscribers = {};
        this.name = options.name;

        if (!this.cid) {
            this.cid = 'pub-' + pubsCID++;
        }
        if ($.isArray(options.subscribe)) {
            i = 0;
            sl = options.subscribe.length;

            for (; i < sl; i++) {
                s = options.subscribe[i];
                s.host.subscribe.apply(s.host, [that, s.event, s.fn, s.bind]);
            }
        }

        Publisher.prototype = $.extend(Publisher.prototype, methods);
    }

    Publisher.defaults = {
        name: 'publisher'
    };
    // conf obj Array
    // [{
    //  host: subscriber object,
    //  event: events,
    //  fn: callback handle
    //  bind: boolean – binds the host subscriber-object to the THIS keyword in
    //  the callback handle
    //  }]
    Publisher.prototype = {

        cancelSubscription: (function () {
            var removeSubscription = function (service, subscribers, subscriber) {
                var l = subscribers[service].length,
                i = 0;
                for (; i < l; i++) {
                    if (subscribers[service][i].subscriber === subscriber) {
                        subscribers[service].splice(i, 1);
                    }
                }
            };

            /**
            * @param {Object} subscriber: the subscriber object
            * @param {String} service: name of service to be canceled
            */
            return function (subscriber, service) {
                var subscribers = this.subscribers,
                keys = [],
                services = (function () {
                    var key;
                    for (key in subscribers) {
                        if (subscribers.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }
                    return keys;
                } ()),
                _services = service ? service.split(' ') : services,
                l = _services.length,
                i = 0;

                for (; i < l; i++) {
                    if (services.indexOf(_services[i]) >= 0) {
                        removeSubscription(_services[i], subscribers, subscriber);
                    }
                }
                return this;
            };
        } ()),

        /**
        * @param {String} service: name of service to be published
        * you can pass additional arguments to the publish method.
        *
        */
        publish: function (service) {
            var args = slice.call(arguments, 1),
            subscribers = this.subscribers,
            subscription = subscribers[service],
            i,
            l;

            if (subscription) {
                i = 0;
                l = subscription.length;
                for (; i < l; i++) {
                    subscription[i].fn.apply(null, args);
                }
            }
            return this;
        },

        /**
         * @param {String} service: the service to subscribe to
         * @param {Function} fn: method called on publishing service
         * @param {Object} subscriber: the subscriber Obejct
         */
        setSubscriptions: function (service, fn, subscriber) {
            var subscribers = this.subscribers,
            services = service.split(' '),
            l = services.length,
            i = 0;

            for (; i < l; i++) {
                if (subscribers[services[i]]) {
                    subscribers[services[i]].push({
                        fn: fn,
                        subscriber: subscriber
                    });
                } else {
                    subscribers[services[i]] = [{
                        fn: fn,
                        subscriber: subscriber
                    }];
                }
            }
            return this;
        }
    };

    Subscriber = function (name) {
        this.name = typeof name === 'string' ? name: 'subscriber';
        this.cid = this.cid ? this.cid: 'sub-' + subsCID++;
    };

    Subscriber.prototype = {
        /**
        * @param {Object} publ: the Publisher to subscribe to
        * @param {String} service: the service to subscribe to
        * @param {Function} fn: the function to be called when service is published
        * @param {Boolean} bind: optional, defaults to true
        * set to false, if you don't want to pass in your Subscriber Object as
        * context
        */
        subscribe: function (publ, service, fn, bind) {
            var args = slice.call(arguments, 0),
            publisher = args.shift(),
            useProxy;

            if (typeof bind === 'boolean') {
                args.pop();
            }

            args.push(this);
            //args.unshift(args[1]);
            if (args.length < 2 || typeof args[0] !== 'string') {
                throw new Error('no subsriptions supplied');
            }
            if (publisher && publisher.setSubscriptions) {
                if (typeof args[1] === 'string' && typeof this[args[1]] === 'function') {
                    args[1] = $.proxy(this[args[1]], this);
                } else {
                    useProxy = typeof bind === 'boolean' ? bind: true;
                    args[1] = useProxy ? $.proxy(args[1], this) : args[1];
                }
                publisher.setSubscriptions.apply(publisher, args);
            } else {
                throw new Error('no publisher supplied for event "' + event + '" or publisher method ´setSubscriptions´ not found');
            }
            return this;
        },
        /**
        * @param {Object} publisher: the Publisher to unsubscribe from
        * @param {String} service: the service to unsubsubscribe from
        */
        unsubscribe: function (publisher, service) {
            publisher.cancelSubscription.call(publisher, this, service);
            return this;
        }
    };

    Observer = Publisher;
    Observer.prototype = $.extend({
        on: function (event, callback) {
            return this.subscribe(this, event, callback);
        }
    }, Publisher.prototype, Subscriber.prototype);

    exports = {
        Observer: function (options, methods) {
            return new Observer(options, methods);
        },
        Publisher: function (options, methods) {
            return new Publisher(options, methods);
        },
        Subscriber: function (options, methods) {
            return new Subscriber(options, methods);
        }
    };

    if (typeof module !== 'undefined') {
        module.exports = exports;
    } else {
        $.extend($, exports);
    }

}(this));
