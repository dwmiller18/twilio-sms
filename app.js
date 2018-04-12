var express = require('express');       // imports express module
var app = express();        // creates an instance of express
var port = 3000;            // sets the port for the service
var fs = require('fs');     // imports file system module
var creds = JSON.parse(fs.readFileSync('creds.json'));     // gets credentials from creds.json
var bodyParser = require('body-parser');    //imports body-parser
var logger = require('morgan');     // imports morgan
var cors = require('cors');         // imports cors

app.use(cors());        // cross origin resource sharing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));     // logging module to display different detail

// require the Twilio module and create a REST client
const client = require('twilio')(creds.accountSid, creds.authToken);

app.use("/", express.static("static"));

// get api for health check
app.get('/health', function(req, res){      // request and response
    res.statusCode = 200;       // if 200 status, print json string
    res.end(JSON.stringify({
        name: 'Twilio SMS', 
        version: 1.0
    }));
});

// post api to send a message, called in send button
app.post('/message', function(req, res) {
    var toNumber = req.body.toNumber;   // gets the num from passed in json
    var message = req.body.message;     // gets the message from passed in json

    // if no number, respond w/ a 400 status and error mmessage
    if (toNumber == null) {
        res.statusCode = 400;
        res.json({error: 'no to number in toNumber field'});
        return;
    }

    // if no message, respond w/ a 400 status and error message
    if (message == null) {
        res.statusCode = 400;
        res.json({error: 'no message in message field'});
        return;
    }

    // send an sms message with twilio
    client.messages
    .create({       // creates the message w/ the to and from numbers and sends it
        to: toNumber,       // taken from passed in json
        from: creds.fromNumber,     // gets from the creds json
        body: message       // taken from passed in json
    })
    .then((recResponse) => {        // if success, gives success message
        res.json({
            "result":"success"
        })  
    })
    .catch((e) => {     // catch the error
        res.statusCode = 400;   // responds with a 400
        res.json({              // prints error with reason for 400
            "result":"error: " + e.message
        })
        console.log(e);         // logs error into console
    })
});

// runs the service, lets the app listen for http requests
app.listen(port, function(){console.log("app running")});   
