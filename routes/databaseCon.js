var databaseCon = function(){
	var CLASS = "databaseCon";
	var METHOD = CLASS + ".main: ";
	
	var DB_URL_LOCAL = 'mongodb://localhost:27017/bloodhoudDB';
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
			
			var mongoURL = DB_URL_LOCAL;
			if (process.env.VCAP_SERVICES)
				{
					//on cloudfoundry
					console.log(METHOD + " Deploy on cloudfoundry");
					var services = JSON.parse(process.env.VCAP_SERVICES);
					var serviceKey = Object.keys(services)[0]
					mongoURL = services[serviceKey][0].credentials.uri;
				}
			else
				{
					//on locale
					console.log(METHOD + " Deploy on local");
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


