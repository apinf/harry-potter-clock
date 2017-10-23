var mongo = require('./dataBaseStuff');
var server = require('./networkThings');
var events = require('events');
global.eventEmitter = new events.EventEmitter();


mongo.initDatabase();

//mongo.updateLocation(23, 45, "kille", function(err, result){console.log("olikesa oli mopo " + result)});

var DB_READYHandler = function () {
	console.log('Received DB READY');
	server.initServer();	
}

var SERVER_READYHandler = function () {
        console.log('Received SERVER READY');        
}

var REGISTERHandler = function (id) {
        console.log('Received REGISTER for ID: ' + id);
	//THIS IS NOT NEEDED? CALL STRAIGHT FROM NWSTUFF CODE
}

//Assign the event handlers to events:
eventEmitter.on('DB_READY', DB_READYHandler);
eventEmitter.on('SERVER_READY', SERVER_READYHandler);
eventEmitter.on('REGISTER', REGISTERHandler);

