var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//var events = require('events');
var mongo = require('./dataBaseStuff');

app.use(bodyParser.urlencoded({extended: true}));

exports.initServer = function(){
var server = app.listen(2223, function (){
        var host = server.address().address
        var port = server.address().port
        console.log("app listening at http://%s:%s", host, port);
	global.eventEmitter.emit("SERVER_READY");
})
}
app.get('/test', function(req, res){
	res.end("OK all great!");

});

app.post('/updatelocation', function(req, res){
	var userId = req.query.id;
	var lng = req.query.lng;
	var lat = req.query.lat;
	console.log("upd " + userId + " " + lat + "," + lng + " " + (new Date().getTime()));
	mongo.updateLocation(lng, lat, userId, function(err, result){
		if(err){res.end(err);}
		if(result = "OK_updated"){
			res.end("OK_updated " + userId);
		}

	});	
})

app.post('/register', function(req, res){
	var userId = req.query.id;
	console.log("in register");
	mongo.register(userId, function(err, result){
		console.log("ressing result " + userId);
		if(err){res.end(err);}
		if(result = "OK_registered"){
			res.end("OK_registered:" + userId)
		}
	});	
})


