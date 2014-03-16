var whatsappDb = function(){
	var CLASS = "whatsappDb";
	
	var database = require('./database');
	var phoneDb = require('./phoneDb');
	
	var BSON = require('mongodb').BSONPure;

	var findAll = function(callback)
    	{
    		var METHOD = CLASS + ".findAll: ";
			console.log(METHOD + 'Retrieving all whatsapp');
			database.collection(
				database.collectionNames.WHATSAPP, 
				function(err, collectionWhatsapp)
					{
						collectionWhatsapp.find().toArray(
							function(err, whatsapp)
								{
									console.log(METHOD + "err: " + err);
									if (!err)
										{
											console.log(METHOD + "Retrieved nun whatsapp: " + whatsapp.length);
											//console.log(METHOD + "Retrieved whatsapp: " + JSON.stringify(whatsapp));
											callback(null,  whatsapp);
										}
									else
										{
											console.log(METHOD + "Errore:" + err);
											var whatsapp = {phone_id:0, _id: 0, imei: "", direction: "", timespamp: "1970-01-01 00:00:00", phoneNumber: "", text: ""};
											callback(err,  whatsapp);
										}
									}
						);
					}
			);
    	}

	var findAllByIdPhone = function(idPhone, callback)
    	{
    		var METHOD = CLASS + ".findAllByIdPhone: ";
			console.log(METHOD + 'Retrieving all whatsapp for phone with id: ' + idPhone);
			database.collection(
				database.collectionNames.WHATSAPP, 
				function(err, collectionWhatsapp)
					{
						collectionWhatsapp.find(
							//{'phone_id':  new BSON.ObjectID(idPhone)},
							 {'imei':  idPhone},
							function(err, cursorWhatsapp)
								{
									cursorWhatsapp.toArray(
										function(err, whatsapp)
											{
												console.log(METHOD + "err: " + err);
												if (!err)
													{
														console.log(METHOD + "Retrieved nun whatsapp: " + whatsapp.length);
														//console.log(METHOD + "Retrieved whatsapp: " + JSON.stringify(whatsapp));
														callback(null,  whatsapp);
													}
												else
													{
														console.log(METHOD + "Errore:" + err);
														var whatsapp = {phone_id:0, _id: 0, imei: "", direction: "", timespamp: "1970-01-01 00:00:00", phoneNumber: "", text: ""};
														callback(err,  whatsapp);
													}
												}
										);
								}
						);
					}
			);    			
    	}

		/*
		* 
		*/
	 	var find = function(params, callback)
	    	{
	    		var METHOD = CLASS + ".find: ";
				
				if (typeof params !== 'undefined'){
					console.log(METHOD + 'params: ' + JSON.stringify(params));
					
					var query = {};
					var qBuilder = new queryBuilder();
					
					var idPhone = params.idPhone;
					if (typeof idPhone !== 'undefined'){
						console.log(METHOD + 'idPhone: ' + idPhone);
						//qBuilder.andEqual("phone_id", new BSON.ObjectID(idPhone));
						qBuilder.andEqual("phone_id", idPhone);
					}
						
					var day = params.day;
					if (typeof day !== 'undefined'){
						var interval = getIntervalOfSingleDay(day);
						
						console.log(METHOD + 'Day: ' + day);
						console.log(METHOD + 'Interval for Day: ' + JSON.stringify(interval));
						qBuilder.andInIntervalEqual("timestamp", interval.start, interval.end);
					}
					
					var interval = params.interval;
					if (typeof interval !== 'undefined'){
						var intervalNormalized = getIntervalOfIntervalDay(interval.start, interval.end);
						console.log(METHOD + 'Interval: ' + JSON.stringify(intervalNormalized));
						qBuilder.andInIntervalEqual("timestamp", intervalNormalized.start, intervalNormalized.end);
					}
					
					var direction = params.direction;
					if (typeof direction !== 'undefined'){
						console.log(METHOD + 'Direction: ' + direction);
						qBuilder.andEqual("direction", direction);
					}
					
					var phoneNumber = params.phoneNumber;
					if (typeof phoneNumber !== 'undefined'){
						console.log(METHOD + 'Phone number: ' + phoneNumber);
						qBuilder.andEqual("phoneNumber", phoneNumber);
					}
					
					console.log(METHOD + "Query: " + JSON.stringify( qBuilder.query()));
				}
				
				database.collection(
					database.collectionNames.WHATSAPP, 
					function(err, collectionWhatsapp)
						{
							collectionWhatsapp.find(
								qBuilder.query(),
								function(err, cursorWhatsapp)
									{
										cursorWhatsapp.toArray(
											function(err, whatsapp)
												{
													console.log(METHOD + "err: " + err);
													if (!err)
														{
															console.log(METHOD + "Retrieved nun whatsapp: " + whatsapp.length);
															console.log(METHOD + "Retrieved whatsapp: " + JSON.stringify(whatsapp));
															callback(null,  whatsapp);
														}
													else
														{
															console.log(METHOD + "Errore:" + err);
															var whatsapp = {phone_id:0, _id: 0, imei: "", direction: "", timespamp: "1970-01-01 00:00:00", phoneNumber: "", text: ""};
															callback(err,  whatsapp);
														}
													}
											);
									}
							);
						}
				);    
	    	}

		/*
		* 
		*/
	 	var findAllToday = function(callback)
	    	{
	    		var METHOD = CLASS + ".findAllToday: ";
	    		
				var params = {
					idPhone: undefined,
					day: getTodayLikeString(),
					interval: undefined,
					direction: undefined,
					phoneNumber: undefined
				}	    		
				
				//console.log(METHOD + "callback: " + callback);
	    		find(params, callback);
	    	}

	 
		var findById = function(id, callback)
			{
				var METHOD = CLASS + ".findById: ";
				
				console.log(METHOD + 'Retrieving whatsapp by id: ' + id);
				database.collection( database.collectionNames.WHATSAPP, function(err, collection)
					{
						collection.findOne(
							{ '_id': new BSON.ObjectID(id) }, function(err, whatsapp)
							{
								if (!err){
									callback(null, whatsapp);
								}
								else{
									console.log("Errore:" + err);
									var whatsapp = {phone_id:0, _id: 0, imei: "", direction: "", timespamp: "1970-01-01 00:00:00", phoneNumber: "", text: ""}; 
									callback(err, whatsapp);
								}
							});
					});
			};
			
		var create= function (whatsapp, callback)
				{
					var METHOD = CLASS + ".create: ";
					console.log(METHOD + "Creating whatsapp: " + JSON.stringify(whatsapp));
					
					console.log(METHOD + "Timestamp: " + whatsapp.timestamp);
					console.log(METHOD + "Timestamp date: " + new Date(whatsapp.timestamp));
					console.log(METHOD + "Timestamp date UTC: " + convertDateToUTC(new Date(whatsapp.timestamp)));
					
					database.collection(database.collectionNames.WHATSAPP, function(err, collection)
						{
							collection.insert(
								//{ "phone_id": new BSON.ObjectID(whatsapp.phone_id), "direction": whatsapp.direction, "timespamp": new Date(whatsapp.timespamp), "phoneNumber": whatsapp.phoneNumber, "text": whatsapp.text},
								{ "phone_id": whatsapp.phone_id,
									"direction": whatsapp.direction, 
									"timestamp": new Date(whatsapp.timestamp), 
									"phoneNumber": whatsapp.phoneNumber, 
									"nameContact": whatsapp.nameContact,
									"text": whatsapp.text,
									"timeRecord": (new Date()).toISOString()
								},
								function(err, result)
									{
										if (!err)	
											{
												var whatsapp = result[0];
												console.log(METHOD + 'whatsapp created: ' + JSON.stringify(whatsapp));
												callback(null,  whatsapp);
											}
										else
											{
												console.log(METHOD + "Errore: " + err);
												var whatsapp = {phone_id: "", _id: 0, imei: "", direction: "", timestamp: "1970-01-01 00:00:00", phoneNumber: "", text: ""};
												callback(err,  whatsapp);
											}
									});
						});
				};			
			
			
		function queryBuilder() {
			// {author: "Mike", created_on: {$gt: start, $lt: end}}
			
			var query = {};
			this.andEqual = function(name, value)
				{
					query[name] = value;
				}
				
			this.andInIntervalEqual= function(name, min, max)
				{
					var interval = {};
					interval["$gte"] = new Date(min); 
					interval["$lt"] = new Date(max); 
					query[name] = interval;
				}
				
			this.query = function() {
					return query;
			}
			
			var concatenaNewCondition = function(newCondition)
				{
					if (query.length > 0){
						query = query + ", ";
					}
					query = query  + newCondition;
				}
				
		};	
	 

	 
		// from "yyyy-mm-dd" format to date  "yyyy-mm-ddT00:00:00.000T"  
		function getDateStart(day) {
			var parts = day.match(/(\d+)/g);
			// new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
			return  Date.UTC(parts[0], parts[1]-1, parts[2], 0, 0, 0, 0); // months are 0-based
		}		 

		// from "yyyy-mm-dd" format to date "yyyy-mm-ddT23:59:59.000T"  
		function getDateEnd(day) {
			var parts = day.match(/(\d+)/g);	
			// new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
			return  Date.UTC(parts[0], parts[1]-1, parts[2], 23, 59, 59, 999); // months are 0-based
		}		 

		// return today like a date in yyyy-mm-dd 
		function getTodayLikeString() {
			var METHOD = CLASS + ".getIntervalOfToday: ";
		
			var today = (new Date());
			var todayString = today.getUTCFullYear();
			todayString += '-';
			if (today.getUTCMonth() > 8){
				todayString += (today.getUTCMonth() + 1);
			}
			else{
				todayString +=  '0' + (today.getUTCMonth() + 1);
			}
			todayString += '-';
			todayString += today.getUTCDate();
			
			console.log(METHOD + "todayString: " + todayString);
			
			return todayString;
		}
		
		// parse a date in yyyy-mm-dd format and return interval [yyyy-mm-dd 00:00:01, yyyy-mm-dd 23:59:59]
		function getIntervalOfToday() {
			var METHOD = CLASS + ".getIntervalOfToday: ";
		
			var today = (new Date());
			var todayString = today.getUTCFullYear();
			todayString += '-';
			if (today.getUTCMonth() > 8){
				todayString += (today.getUTCMonth() + 1);
			}
			else{
				todayString +=  '0' + (today.getUTCMonth() + 1);
			}
			todayString += '-';
			todayString += today.getUTCDate();
			
			console.log(METHOD + "todayString: " + todayString);
			
			return getIntervalOfSingleDay(todayString);
		}			
		
		// parse a date in yyyy-mm-dd format and return interval [yyyy-mm-dd 00:00:01, yyyy-mm-dd 23:59:59]
		function getIntervalOfSingleDay(day) {
			var interval = 
				{
					start: getDateStart(day),
					end: getDateEnd(day)
				}
			return interval;
		}		 
		
		// parse a date in yyyy-mm-dd format and return interval [yyyy-mm-dd 00:00:01, yyyy-mm-dd 23:59:59]
		function getIntervalOfIntervalDay(startDay, endDay) {
			var interval = 
				{
					start: getDateStart(startDay),
					end: getDateEnd(endDay)
				}
			return interval;
		}		 
		
		function convertDateToUTC(date) { 
			return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
		}		
		

		//metodi pubblici
		return {
			findAll: findAll,
			find: find,
			findAllToday: findAllToday,
			//findAllByIdPhone: findAllByIdPhone,
			//findById: findById,
			create: create
		}
}();

	
module.exports = whatsappDb;


