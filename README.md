# A light-weight PubSub module on Top of jQuery 

[![Build Status](https://secure.travis-ci.org/iwyg/jquery.observer.png?branch=master)](https://travis-ci.org/iwyg/jquery.observer)

## Usage

### Simple case scenario:

```js

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
```

### pass methods to your Observers

```js
var methods = {
	foo: function() {
		console.log('foo');
	}
};
var myPublisher = $.Observer('Observer Name', methods);

myPublisher.foo(); // logs 'foo'
```

### chainable

```js
// Observers are chainable
var myObserver = $.Observer();	
myObserver.subscribe(PublisherA, 'serviceA', function (){ … }).unsubscribe(PublisherB, 'serviceB').publish('someservice', args);
```
	
### run mocha tests

```sh
> npm install
> mocha -R list
```

### more examples to come	
