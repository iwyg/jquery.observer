var jsdom = require('jsdom'),
jQuery = require("jQuery"),
window = jsdom.jsdom("<html><body></body></html>").createWindow(),
document = window.document,
$ = global.jQuery = jQuery.create(window);

var obs = require("../src/jquery.observer");
jQuery.extend(jQuery, obs);


var observer = jQuery.Observer(),
subscriber = jQuery.Subscriber();

describe('Observer', function () {
    describe('#publish', function () {

        it('subscriber callback should fire', function (done) {
            subscriber.subscribe(observer, 'event', done);
            observer.publish('event');
        });

    });

});

describe('Subscriber', function () {
    describe('#unsubscribe', function () {

        it('subscriber callback should not fire', function (done) {
            var i = 0;
            subscriber.subscribe(observer, 'foo', function () {
                throw 'should not fire';
            });

            subscriber.unsubscribe(observer, 'foo');
            observer.publish('foo');

            done();
        });
    });

});
