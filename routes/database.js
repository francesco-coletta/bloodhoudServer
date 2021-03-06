//constant enum
var collectionNames =  {
	PHONE: "phones",
	CALL: "call",
	SMS: "sms",
	WHATSAPP: "whatsapp",
};



var database = function(){
	var CLASS = "database";
	var METHOD = CLASS + ".main: ";

	var dbConnection = require('./databaseCon');
	var db;
	
	dbConnection(				
				function(err, database)
					{
						if (!err)
							{
								db = database;
								console.log(METHOD + "Connected do DB");
								db.collection(
									collectionNames.SMS,
									{ strict: true }, 
									function(err, collection)
										{
											if (err != null)
												{
													console.log("The " + collectionNames.SMS  +" collection doesn't exist. Creating it with sample data...");
													//db.collection(smsCollection).drop();
													db.collection(collectionNames.PHONE).drop();
													db.collection(collectionNames.CALL).drop();
													populateDB();
												}
											else{
												console.log(METHOD + "Collection already present");
											}
										}
								);
							}
						else{
							console.log(METHOD + "Errore: " + err);
						}
					}
		);
		
	console.log(METHOD + " creation complete");
	
	
	/*--------------------------------------------------------------------------------------------------------------------*/
	// Populate database with sample data -- Only used once: the first time the application is started.
	// You'd typically not find this code in a real-life app, since the database would already exist.
	 function  populateDB()
		{
			populatePhonesCollection();
			
		};

	

	function populatePhonesCollection ()
		{
			var METHOD = CLASS + ".populatePhonesCollection: ";
			var phones = [
		    			{ imei: "123456789012340", name: "XXXX", phoneNumberSim1: "0123456789", phoneNumberSim2: ""},
		    			{ imei: "123456789012341", name: "SAMSUNG", phoneNumberSim1: "0123456789", phoneNumberSim2: ""},
		    			{ imei: "123456789012342", name: "HTC", phoneNumberSim1: "0123456789", phoneNumberSim2: ""}];
			              
			db.collection(collectionNames.PHONE, function(err, collection)
				{
					collection.insert(
					    phones,
						function(err, result)
							{
								console.log(METHOD + 'Populate phones collection: ' + phones.length);
								populateSmsCollection();
								populateCallCollection();
							}
					);
				});
		};
		
		
		function populateSmsCollection ()
			{
				var METHOD = CLASS + ".populateSmsCollection: ";
				var sms = [
			    			{ phone_id: null, direction: "outgoing", timestamp: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0)), phoneNumber: "1111111111", nameContact: "xxxx", text: "sms a 1111111111", timeRecord: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0))},
			    			{ phone_id: null, direction: "incoming", timestamp: new Date(Date.UTC(2013, 0, 20, 20, 20, 29, 0)), phoneNumber: "1111111111", nameContact: "xxxx", text: "sms da 1111111111", timeRecord: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0))},
			    			{ phone_id: null, direction: "outgoing", timestamp: new Date(Date.UTC(2013, 0, 24, 20, 20, 29, 0)), phoneNumber: "2222222222", nameContact: "xxxx", text: "sms a 22222222", timeRecord: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0))},
			    			{ phone_id: null, direction: "incoming", timestamp: new Date(Date.UTC(2013, 0, 25, 10, 15, 29, 0)), phoneNumber: "2222222222", nameContact: "xxxx", text: "sms da 222222", timeRecord: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0))},
			    			{ phone_id: null, direction: "outgoing", timestamp: new Date(Date.UTC(2013, 0, 27, 27, 38, 29, 0)), phoneNumber: "1111111111", nameContact: "xxxx", text: "sms a 1111111111", timeRecord: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0))}
			    			];
				db.collection(
				              collectionNames.SMS, 
				              function(err, collectionSms)
				              	{
				    				db.collection(collectionNames.PHONE).find(
                                          {},
                                          function(err, cursorPhones)
                                          	{
                                          		var indexPhone = 0; 
                    							cursorPhones.each(
                    				                 function(err, phone) 
                    				                 	{
                    										if(phone != null) 
                    											{
                    												indexPhone++;
                    												console.log(METHOD);
                    												console.log(METHOD + indexPhone + ' phone : ' + JSON.stringify(phone));
                    												
                    												for (var i = 0; i < sms.length; i++)
                    													{
                    														console.log(METHOD + ' sms[' + i + "] = " + JSON.stringify(sms[i]));
                    														//sms[i].phone_id = phone._id;
                    														sms[i].phone_id = phone.imei;
                    														collectionSms.insert(
                    														                     { "phone_id": sms[i].phone_id, "direction": sms[i].direction, "timestamp": sms[i].timestamp, "phoneNumber": sms[i].phoneNumber, "nameContact": sms[i].nameContact, "text": sms[i].text,  "timeRecord": sms[i].timeRecord},
                    														                     function(err, result)
                    														                     {
                    														                    	 console.log(METHOD + i + ' inserted sms: ' + JSON.stringify(sms[i]));
                    														                     });
                    													}
                    											}
                    								}); //each
                                          	}); // collectionPhone.find
								}); //collectionSms
			};
					
		
		function populateCallCollection ()
			{
				var METHOD = CLASS + ".populateCallCollection: ";
				var call = [
			    			{ phone_id: null, direction: "outgoing", timestampStart: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0)), timestampEnd: new Date(Date.UTC(2013, 0, 20, 18, 16, 29, 0)), phoneNumber: "1111111111", nameContact: "xxxx", state: "ringing", duration: "3", timeRecord: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0))},
			    			{ phone_id: null, direction: "incoming", timestampStart: new Date(Date.UTC(2013, 0, 20, 20, 20, 29, 0)), timestampEnd: new Date(Date.UTC(2013, 0, 20, 18, 17, 29, 0)), phoneNumber: "1111111111", nameContact: "xxxx", state: "accepted", duration: "4", timeRecord: new Date(Date.UTC(2013, 0, 20, 18, 15, 29, 0))},
			    			];
				db.collection(
				              collectionNames.CALL, 
				              function(err, collectionCall)
				              	{
				    				db.collection(collectionNames.PHONE).find(
                                          {},
                                          function(err, cursorPhones)
                                          	{
                                          		var indexPhone = 0; 
                    							cursorPhones.each(
                    				                 function(err, phone) 
                    				                 	{
                    										if(phone != null) 
                    											{
                    												indexPhone++;
                    												console.log(METHOD);
                    												console.log(METHOD + indexPhone + ' phone : ' + JSON.stringify(phone));
                    													
                    												for (var i = 0; i < call.length; i++)
                    													{
                    														console.log(METHOD + ' call[' + i + "] = " + JSON.stringify(call[i]));
                    														call[i].phone_id = phone.imei;
                    														collectionCall.insert(
                    														                     { "phone_id": call[i].phone_id, "direction": call[i].direction, "timestampStart": call[i].timestampStart, "timestampEnd": call[i].timestampEnd, "phoneNumber": call[i].phoneNumber, "nameContact": call[i].nameContact, "state": call[i].state, "duration": call[i].duration, "timeRecord": call[i].timeRecord},
                    														                     function(err, result)
                    														                     {
                    														                    	 console.log(METHOD + i + ' inserted call: ' + JSON.stringify(call[i]));
                    														                     });
                    													}		
                    															
                    											}
                    								}); //each
                                          	}); // collectionPhone.find
								}); //collectionSms
			};
			
	var showDB = function()
		{
			showPhones();
			showSmss();
		};
			

		function showPhones ()
			{
				var METHOD = CLASS + ".showPhones: ";
				console.log(METHOD + "PHONES:");
				db.collection(collectionNames.PHONE).find(
		  					                              {},
		  					                              function(err, cursorPhone)
		  					                              	{
			  					                              	var index = 0; 
			  					                              	cursorPhone.each(
			  					        				                 function(err, phone) 
			  					        				                 	{
			  					        										if(phone != null) 
			  					        											{
			  					        												index++;
			  					        												console.log(METHOD + index + "= " + JSON.stringify(phone));
			  					        											}
			  					        									});
		  					                              	});
			};
		
	function showSmss ()
		{
			var METHOD = CLASS + ".showSmss: ";
			console.log(METHOD + "SMS:");
			
			db.collection(collectionNames.SMS).find(
  					                              {},
  					                              function(err, cursorSms)
  					                              	{
  					                              		var index = 0; 
  					                              		cursorSms.each(
  					        				                 function(err, sms) 
  					        				                 	{
  					        										if(sms != null) 
  					        											{
  					        												index++;
  					        												console.log(METHOD + index + "= " + JSON.stringify(sms));
  					        											}
  					        									});
  					                              	});
		};

		
		
		
	var purgeDatabase = function(request, response)		
		{
			var METHOD = CLASS + ".purgeDatabase: ";
			dbConnection(				
				function(err, database)
					{
						if (!err)
							{
								db = database;
								db.collection(collectionNames.PHONE).drop();
								console.log(METHOD + "Dropped collectionNames.PHONE");
								
								db.collection(collectionNames.SMS).drop();
								console.log(METHOD + "Dropped collectionNames.SMS");
					
								db.collection(collectionNames.CALL).drop();
								console.log(METHOD + "Dropped collectionNames.CALL");
								
								db.collection(collectionNames.WHATSAPP).drop();
								console.log(METHOD + "Dropped collectionNames.WHATSAPP");
							}
						else{
							console.log(METHOD + "Errore: " + err);
						}
					}
			);
			response.send("Dropped ALL collections into mongoDB");
		};


	// Populate database with sample data -- Only used once: the first time the application is started.
	// You'd typically not find this code in a real-life app, since the database would already exist.
	var loadTestData = function(request, response)
		{
			var METHOD = CLASS + ".loadTestData: ";
			dbConnection(				
				function(err, database)
					{
						if (!err)
							{
								db = database;
								populateDB();
							}
						else{
							console.log(METHOD + "Errore: " + err);
						}
					}
			)
			response.send("Test data loaded into collections mongoDB");
		}

	//rende disponibile il db
	var istanceDb = function(callback)
		{
			dbConnection(				
				function(err, database)
					{
						callback(err, database);
					}
			)
		}	
	
	var collection = function(collectionName, callback)
		{
			var METHOD = CLASS + ".collection: ";
			istanceDb(function(err, database)
					{
						database.collection(
							collectionName, 
							function(err, collection)
								{
									console.log(METHOD + "GetCollection: " + collectionName);
									callback(err, collection);
								}
						)
					}
			)
		}
	
	//public
	return {
		collectionNames: collectionNames,
		purgeDatabase: purgeDatabase, 
		loadTestData: loadTestData,
		istanceDb: istanceDb,
		collection: collection
	};
}();


module.exports = database;



