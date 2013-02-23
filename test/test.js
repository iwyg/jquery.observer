describe('jQuery', function () {
	describe('Observer', function () {
		var observer = $.Observer(),
		subscriber = $.Subscriber();

		it('subscriber callback should fire', function (done) {
			subscriber.subscribe(observer, 'event', done);
			observer.publish('event');
		});
	});
});
