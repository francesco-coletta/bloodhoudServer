/*
 * Bloodhound Server
 * 
 */

/*
 * carico i moduli nativi necessari
 */

// Express web development framework
var express = require('express');

// Websocket (http://socket.io/#how-to-use)
var http = require('http');
var io = require('socket.io');


var phone = require('./routes/phone');
var sms = require('./routes/sms');
var call = require('./routes/call');
var whatsapp = require('./routes/whatsapp');
var database = require('./routes/database');
var ws_server = require('./bloodhoud_ws_server');


// crea una applicazione
var app = express();

//  bind socket.io to the express server
var server = http.createServer(app);
var wsServer  = io.listen(server);

// sets the log level of socket.io, with
// log level 2 we wont see all the heartbits
// of each socket but only the handshakes and
// disconnections
wsServer.set('log level', 2);

// setting the transports by order, if some client
// is not supporting 'websockets' then the server will
// revert to 'xhr-polling' (like Comet/Long polling).
// for more configurations go to:
// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
wsServer.set('transports', [ 'websocket', 'xhr-polling' ]);


app.configure(
	function () {
		app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
		app.use(express.bodyParser());
		app.locals.pretty = true;
	}
);


// configure express, since this server is
// also a web server, we need to define the
// paths to the static files
app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/images", express.static(__dirname + '/public/images'));

//set path to the views (template) directory
app.set('views', __dirname + '/views');
//set path to static files
app.use(express.static(__dirname + '/public'));
 
// serving the main applicaion file (index.html)
// when a client makes a request to the app root
// (http://localhost:8080/)
app.get('/', function (request, response) {
	response.sendfile(__dirname + '/public/index.html');
});

//PURGE DATABASE
app.delete('/database', database.purgeDatabase);
//RELOAD TEST DATA INTO COLLECTION
app.post('/database', database.loadTestData);

// PHONE
app.get('/phones', phone.find);
app.get('/phones/phone-:imei', phone.find);

//info del generico telefono
//app.get('/phones/phone-:id', phone.findById);


// SMS
//tutti gli sms
app.get(
	'/phones/sms', 
	function(request, response){
	    response.format({
	        'application/json': sms.findAll,
	        'text/html': sms.findAllHTML,
	        'text/plain': function(){
	            	response.send('TODO TEXT');
	        	}
		})
	}
);


/*
 * sms di un telefono che rispettano determinate condizioni
 * I parametri della query string possono essere:
 * - day=yyyy-mm-dd
 * - interval[start]=yyyy-mm-dd&interval[end]=yyyy-mm-dd
 * - direction=outgoing/incoming
 * - phoneNumber=1234567890
 * 
 */
app.get(
	'/phones/phone-:imei/sms',
	function(request, response){
	    response.format({
	        'application/json': sms.find,
	        'text/html': function(){
	            	response.send('<strong>TODO HTML</strong>');
	        	},
	        'text/plain': function(){
	            	response.send('TODO TEXT');
	        	}
		})
	}
);


//dettaglio di un sms di un telefono
//app.get('/phones/phone-:id/smss/sms-:idSms', sms.findById);


// CALL
//tutti gli call
app.get('/phones/call', call.findAll);


/*
 * call di un telefono che rispettano determinate condizioni
 * I parametri della query string possono essere:
 * - day=yyyy-mm-dd
 * - interval[start]=yyyy-mm-dd&interval[end]=yyyy-mm-dd
 * - direction=outgoing/incoming
 * - phoneNumber=1234567890
 * 
 */
app.get('/phones/phone-:imei/call', call.find);

//WHATSAPP
//tutti i messaggi whatsapp
app.get(
	'/phones/whatsapp', 
	function(request, response){
	    response.format({
	        'application/json': whatsapp.findAll,
	        'text/html': whatsapp.findAllHTML,
	        'text/plain': function(){
	            	response.send('TODO TEXT');
	        	}
		})
	}
);


/*
 * i messaggi whatsapp di un telefono che rispettano determinate condizioni
 * I parametri della query string possono essere:
 * - day=yyyy-mm-dd
 * - interval[start]=yyyy-mm-dd&interval[end]=yyyy-mm-dd
 * - direction=outgoing/incoming
 * - phoneNumber=1234567890
 * 
 */
app.get(
	'/phones/phone-:imei/whatsapp',
	function(request, response){
	    response.format({
	        'application/json': whatsapp.find,
	        'text/html': function(){
	            	response.send('<strong>TODO HTML</strong>');
	        	},
	        'text/plain': function(){
	            	response.send('TODO TEXT');
	        	}
		})
	}
);



// ADD new phone
/*
 * nel post vanno specificati i seguenti dati
 * imei=123456789012341
 * name=tizio
 * phoneNumberSim1=0123456789
 * phoneNumberSim2=0123456789
*/
app.post('/phones', phone.create);

// DELETE phone
//NB: chiave e non IMEI
app.delete('/phones/phone-:id', phone.remove);


// ADD new SMS
/*
 * nel post vanno specificati i seguenti dati
 * direction=outgoing/incoming
 * phoneNumber=0123456789
 * timespamp=YYYY-MM-DDTHH:mm:ss.000Z (UTC)
 * text=
*/
//app.post('/phones/phone-:imei/sms', sms.create);
app.post('/phones/phone-:imei/sms', function(request, response){
	wsServer.sockets.emit("newSms", { sms: sms.create(request, response) } );
});

// ADD new CALL
/*
 * nel post vanno specificati i seguenti dati
 * direction=outgoing/incoming
 * phoneNumber=0123456789 
 * timestampStart=YYYY-MM-DDTHH:mm:ss.000Z (UTC)  
 * timestampEnd=YYYY-MM-DDTHH:mm:ss.000Z (UTC) 
 * phoneNumber=xxxx
 * nameContact=xxxx
 * state=xxxx
 * duration=xx
*/
//app.post('/phones/phone-:imei/call', call.create);
app.post('/phones/phone-:imei/call', function(request, response){
	wsServer.sockets.emit("newCall", { call: call.create(request, response) } );
});

// ADD new WHATSAPP
/*
 * nel post vanno specificati i seguenti dati
 * direction=outgoing/incoming
 * phoneNumber=0123456789
 * timespamp=YYYY-MM-DDTHH:mm:ss.000Z (UTC)
 * text=
*/
app.post('/phones/phone-:imei/whatsapp', function(request, response){
	wsServer.sockets.emit("newWhatsapp", { whatsapp: whatsapp.create(request, response) } );
});



// ##########################################
// WEBSOCKET


// socket.io events, each connection goes through here
// and each event is emited in the client.
// I created a function to handle each event
wsServer.sockets.on('connection', function (socket) {
		//send to client welcome message
		ws_server.connect(socket);

		// after connection, the client sends us the message that it is ready for data
        socket.on('clientReady', function(data) {
            ws_server.clientReady(socket, data);
        });		

		// after the phone list, the client is waiting for today sms
        socket.on('waitForTodaySms', function(data) {
            ws_server.sendTodaySms(socket, data);
        });		

		// after the sms list, the client is waiting for today call
        socket.on('waitForTodayCall', function(data) {
            ws_server.sendTodayCall(socket, data);
        });		

		// after the call list, the client is waiting for today whatsapp messages
        socket.on('waitForTodayWhatsapp', function(data) {
            ws_server.sendTodayWhatsapp(socket, data);
        });		


		// when a client calls the 'socket.close()'
		// function or closes the browser, this event
		// is built in socket.io so we actually dont
		// need to fire it manually
		socket.on('disconnect', function(){
				ws_server.disconnect(socket);
			});
	});


var INADDR_ANY = '127.0.0.1'; //'0.0.0.0';
var serverHost = process.env.OPENSHIFT_NODEJS_IP || INADDR_ANY;
var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 1337;


//app.listen(serverPort);
server.listen(serverPort, serverHost);

console.log("> SERVER STARTED");
console.log("> SERVER LISTENING at http://" + serverHost + ":" + serverPort);
