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
* @version 0.01
* @author thomas appel, mail@thomas-appel.com
*/

(function ($, global, undefined) {

	var slice = Array.prototype.slice;

	if (typeof $.isObject === 'undefined') {
		$.isObject = function (obj) {
			return obj && obj.toString().toLowerCase() === '[object object]';
		};
	}

	/**
	 * @param {String} name: Obejct name
	 * @param {Object} methods: optional
	 */
	function Publisher(name, methods) {
		this.name = name || 'publisher';
		this.subscribers = {};
		if ($.isObject(methods)) {
			$.extend(this, methods);
		}
		return this;
	}

	Publisher.prototype = {

		cancelSubscription: (function () {
			var removeSubscription = function (service, subscribers, subscriber) {
				var l = subscribers[service].length, i = 0;
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
				var subscribers = this.subscribers, keys = [],
				services = (function () {
					var key;
					for (key in subscribers) {
						if (subscribers.hasOwnProperty(key)) {
							keys.push(key);
						}
					}
					return keys;
				}()),
				_services = service ? service.split(' ') : services,
				l = _services.length, i = 0;

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
			i, l;

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
			services = service.split(' '), l = services.length, i = 0;

			for (; i < l; i++) {
				if (subscribers[services[i]]) {
					subscribers[services[i]].push({fn: fn, subscriber: subscriber});
				} else {
					subscribers[services[i]] = [{fn: fn, subscriber: subscriber}];
				}
			}
			return this;
		}
	};

	/**
	 * @param {String} name: Obejct name
	 * @param {Object} methods: optional
	 */
	function Subscriber(name, methods) {
		this.name = name || 'subscriber';
		if ($.isObject(methods)) {
			$.extend(this, methods);
		}
	}

	Subscriber.prototype = {
		/**
		* @param {Object} publ: the Publisher to subscribe to
		* @param {String} service: the service to subscribe to
		* @param {Function} fn: the function to be called when service is published
		* @param {Boolean} proxy: optional, defaults to true
		* set to false, if you don't want to pass in your Subscriber Object as
		* context
		*/
		subscribe: function (publ, service, fn, proxy) {
			var args = slice.call(arguments, 0),
			publisher = args.shift(),
			useProxy;
			args.push(this);
			//args.unshift(args[1]);
			if (args.length < 2 || typeof args[0] !== 'string') {
				throw new Error('no subsriptions supplied');
			}
			if (publisher && publisher.setSubscriptions) {
				useProxy = typeof args[2] === 'boolean' ? args[2] : true;
				args[1] = useProxy ? $.proxy(args[1], this) : args[1];
				publisher.setSubscriptions.apply(publisher, args);
			} else {
				throw new Error('no publisher supplied or publisher method ´setSubscriptions´ not found');
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

	function Observer() {
		Publisher.apply(this, arguments);
	}

	Observer.prototype = $.extend({}, Publisher.prototype, Subscriber.prototype);

	$.Observer = function (name, methods) {
		return new Observer(name, methods);
	};
	$.Publisher = function (name, methods) {
		return new Publisher(name, methods);
	};
	$.Subscriber = function (name, methods) {
		return new Subscriber(name, methods);
	};

	// body
}(this.jQuery, this));

