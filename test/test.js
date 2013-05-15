var jsdom = require('jsdom'),
jQuery = require("jquery"),
window = jsdom.jsdom("<html><body></body></html>").createWindow(),
document = window.document,
$ = global.jQuery = jQuery.create(window);

var obs = require("../src/jquery.observer");
jQuery.extend(jQuery, obs);



describe('Observer', function () {
    describe('#construct', function () {
        var observer = jQuery.Observer('obs', {foo: function () {
            return 'bar';
        }});

        it('observer should inherit passed methods', function (done) {
            if (typeof observer.foo === 'function') {
                done();
            }
        });
        it('observer#foo should return bar', function (done) {
            if (observer.foo() === 'bar') {
                done();
            }
        });

        it('should still work', function (done) {
            observer.subscribe(observer, 'event', done);
            observer.publish('event');
        });
    });
    describe('#publish', function () {
        var observer = jQuery.Observer(),
        subscriber = jQuery.Subscriber();

        it('subscriber callback should fire', function (done) {
            subscriber.subscribe(observer, 'event', done);
            observer.publish('event');
        });
    });

    describe('#on', function () {
        var observer = jQuery.Observer();

        it('should bind callback on itlsef', function (done) {
            observer.on('event', done);
            observer.publish('event');
        });
    });
});

describe('Subscriber', function () {
    describe('#unsubscribe', function () {

        it('subscriber callback should not fire', function (done) {
            var i = 0,
            observer = jQuery.Observer(),
            subscriber = jQuery.Subscriber();
            subscriber.subscribe(observer, 'foo', function () {
                throw 'should not fire';
            });

            subscriber.unsubscribe(observer, 'foo');
            observer.publish('foo');

            done();
        });
    });

});
