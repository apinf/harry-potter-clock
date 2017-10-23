//conn to db. if "userLocation" doesn't exist, create
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/userlocation";
var events = require('events');
var DB = null;
var MAX_COLL_SIZE = 1048576; //Mb

exports.initDatabase = function(){
        MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                console.log("databaseStuff: Database ready!")

                //create collections if they already dont exist.
                db.createCollection('registrations', function(err, collection) {
                        if(err){console.log(err);}
                });
                //cap to 1000 locations, older are dropped
                db.createCollection('userlocations', {capped:true,size:MAX_COLL_SIZE,max:1000},
                        function(err, collection) {});

                console.log("databaseStuff: collections created");

                global.eventEmitter.emit("DB_READY");

                DB = db; //keep DB object for later u
	});
}

exports.updateLocation = function(lng, lat, id,callback){
        //put the object together
	var epoch = (new Date).getTime();
	var locatzione = {id:id, lng:lng, lat:lat, time:epoch};

	 DB.collection("registrations").findOne({id: id}, function(err, document){
                if(err)throw err;
		if(document){
			DB.collection("userlocations").insertOne(locatzione, function(err, res){
				if(err){return callback("ERR_DB_INTERNAL", "Cannot update database");}
                	return callback(null, "OK_updated");
        		});
		}
		else{return callback("ERR_NOT_REGISTERED", "user has not registered");}
	});
}

//callback hell, callback hell
exports.register = function(id,callback){
	var obj = {id: id};
	var allgood = true;
	
        DB.collection("registrations").findOne({id: id}, function(err, document){
                if(err)throw err;	
                if(document){
			allgood = false;			                                                
                        return callback("ERR_EXISTED", "ERR_already_registered");			
		}
		else{//need to check for count
			DB.collection("registrations").count( function(err, count){
                		if(err)throw err;
                		if(count > 2){
					allgood = false;
                        		return callback("ERR_FULL", "ERR_user_number_limit_exceed");
               			}
				if(allgood){
		                        console.log("CAN DO!");
                		        DB.collection("registrations").insertOne(obj, function(err, res){
                                		if (err){ return callback("ERR_GENERIC", err); }
                                		return callback(null, "OK_registered"); //no err
                        		});
                		}
        		});
		}	
	});
}

