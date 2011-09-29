# A Observer Model on Top of the jQuery Javascript Library
## Usage

### Simple case scenario:

    // define your Publisher and Subscriber
	// you can also call $.Observer that inherits all methods 
	// both form $.Subscriber and $.Publisher
	var myPublisher = $.Publisher();
	var myListener = $.Subscriber();

	// subscribe to a service	
	myListener.subscribe(myPublisher, 'someservice', function () {
		console.log('success');
    });

	// or to more than one	
	myListener.subscribe(myPublisher, 'someservice anotherone', function () {
		console.log('success');
    });

	// publish service	
	// you can pass additional arguments
	myPublisher.publish('someservice', arg1, arg2); // logs 'success'

	// cancel subscription
	myListener.unsubscribe(myPublisher, 'someservice');
	// or
	myPublisher.cancelSubscription(myListener, 'someservice');

### pass methods to your Observers
	var methods = {
		foo: function() {
			console.log('foo');
		}
	};
	var myPublisher = $.Observer('Observer Name', methods);

	myPublisher.foo(); // logs 'foo'

### chainable

	// Observers are chainable
	var myObserver = $.Observer();	
	myObserver.subscribe(PublisherA, 'serviceA', function (){ … }).unsubscribe(PublisherB, 'serviceB').publish('someservice', args);
	

### more examples to come	
	
