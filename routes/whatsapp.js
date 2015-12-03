var whatsapp = function (){
		var CLASS = "whatsapp";

		var whatsappDb = require('./whatsappDb');
		var phoneDb = require('./phoneDb');
		
		var findAll = function(request, response)
			{
				var METHOD = CLASS + ".findAllByIdPhone: ";
				
				console.log(METHOD + 'Retrieved all whatsapp messages');
				
				whatsappDb.findAll(
					function(err, whatsapp)
						{
						console.log(METHOD + "Retrieved " + whatsapp.length + " whatsapp");
						response.send(whatsapp);
				});
			};



		var findAllHTML = function(request, response)
			{
				var METHOD = CLASS + ".findAllByIdPhone: ";
				console.log(METHOD + 'Retrieved all whatsapp');
				whatsappDb.findAll(
					function(err, whatsapp){
						response.render('whatsapp.jade', {title: 'All whatsapp', items: whatsapp});
					}
				);
			};


		/*
		var findAllByIdPhone = function(request, response)
			{
				var METHOD = CLASS + ".findAllByIdPhone: ";
				
				var id = request.params.id;
				console.log(METHOD + 'Retrieved whatsapp for phone with id: ' + id);
				
				whatsappDb.findAllByIdPhone(
					id, 
					function(err, whatsapp)
						{
						console.log(METHOD + "Retrieved " + whatsapp.length + " whatsapp");
						response.send(whatsapp);
				});
			};
		*/
			
		/*
		 * whatsapp di un telefono che rispettano determinate condizioni
		 * I parametri della query string possono essere:
		 * - day=yyyy-mm-dd
		 * - interval[start]=yyyy-mm-dd&interval[end]=yyyy-mm-dd
		 * - direction=outgoing/incoming
		 * - phoneNumber=1234567890
		 * 
		 */
		var find = function(request, response)
			{
				var METHOD = CLASS + ".find: ";
			
				//var idPhone = request.params.id;
				var idPhone = request.params.imei;
				console.log(METHOD + 'Retrieve whatsapp for phone with id: ' + idPhone);
					
				var day = request.query.day;
				if (typeof day !== 'undefined'){
					console.log(METHOD + 'Retrieve whatsapp in day: ' + day);
				}
				
				var interval = request.query.interval;
				if (typeof interval !== 'undefined'){
					console.log(METHOD + 'Retrieve whatsapp into interval: ' + JSON.stringify(interval));
				}
				
				var direction = request.query.direction;
				if (typeof direction !== 'undefined'){
					console.log(METHOD + 'Retrieve whatsapp with direction: ' + direction);
				}
				
				var phoneNumber = request.query.phoneNumber;
				if (typeof phoneNumber !== 'undefined'){
					console.log(METHOD + 'Retrieve whatsapp from/to number: ' + phoneNumber);
				}
				
				var params = {
					idPhone: idPhone,
					day: day,
					interval: interval,
					direction: direction,
					phoneNumber: phoneNumber
				}
				
				whatsappDb.find(
					params,
					function(err, whatsapp)
						{
							response.send(whatsapp);
						}
				);
			};	
			
		var create = function(request, response)
			{
				var METHOD = CLASS + ".create: ";
				
				//var idPhone = request.params.id;
				var idPhone = request.params.imei;
				console.log(METHOD + 'Creating whatsapp for phone with id: ' + idPhone);

 				var whatsapp = request.body;
				console.log(METHOD + "Creating " + JSON.stringify(whatsapp));
				
				whatsapp.phone_id = idPhone;
				
				var newWhatsapp = whatsapp;
				whatsappDb.create(
					whatsapp, 
					function(err, whatsapp)
						{
							console.log(METHOD + "Creato nuovo whatsapp: " + JSON.stringify(whatsapp));
							response.send(whatsapp);
							newWhatsapp = whatsapp;
						}
				);
				return newWhatsapp;
			}

			
		//metodi pubblici
		return {
			findAll: findAll,
			//findAllByIdPhone: findAllByIdPhone,
			find: find,
			findAllHTML: findAllHTML,
			create: create
		}
}();

	
module.exports = whatsapp;


	
	