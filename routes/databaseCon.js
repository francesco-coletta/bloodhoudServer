var databaseCon = function(){
	var CLASS = "databaseCon";
	var METHOD = CLASS + ".main: ";
	
	var DB_NAME = "bloodhoud";
	var mongo = require('mongodb');
	var MongoClient = mongo.MongoClient;
	
	//the MongoDB connection
	var connectionInstance;
	
	// Define options
	var serverOptions = {
	  'auto_reconnect': true
	};

	var connectToDb = function(callback)
		{
			//if already we have a connection, don't connect to database again
			if (connectionInstance) 
			{
				callback(null, connectionInstance);
				return;
			}	
			

			var mongo = {
				"hostname":"localhost",
				"port":27017,
				"username":"",
				"password":"",
				"name":"",
				"db":DB_NAME
			}

			if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
				//on cloud
				console.log(METHOD + " Deploy on cloud RH Openshift");
				mongo.hostname = process.env.OPENSHIFT_MONGODB_DB_HOST;
				mongo.port = process.env.OPENSHIFT_MONGODB_DB_PORT;
				mongo.username = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
				mongo.password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
				mongo.name = process.env.OPENSHIFT_APP_NAME;
			}
			else{
				//on locale
				console.log(METHOD + " Deploy on local");
			}	

			mongo.hostname = (mongo.hostname || 'localhost');
			mongo.port = (mongo.port || 27017);
			mongo.db = (mongo.db || DB_NAME);

			var mongoURL = "";
			if(mongo.username && mongo.password){
				mongoURL = "mongodb://" + mongo.username + ":" + mongo.password + "@" + mongo.hostname + ":" + mongo.port + "/" + mongo.db;
			}
			else{
				mongoURL = "mongodb://" + mongo.hostname + ":" + mongo.port + "/" + mongo.db;
			}			

			console.log(METHOD + "Connecting to DB " + mongoURL);
			MongoClient.connect(
				mongoURL, 
				serverOptions, 
				function(err, database){
					if(!err)
						{
					 		console.log(METHOD + ": Db connected");
					 		connectionInstance = database;
					 		callback(err,  database);
						}
					else
						{
							console.log(METHOD + "Errore:" + err);
							callback(err,  null);
						}
				}
			);	
		};
	
	console.log(METHOD + " creation complete	");

	//public
	return connectToDb;
}();


module.exports = databaseCon;


