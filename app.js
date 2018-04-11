var express = require('express');
var app = express();
var port = 3000;
var fs = require('fs');
var creds = JSON.parse(fs.readFileSync('creds.json'));
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

// require the Twilio module and create a REST client
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/health', function(req, res){
    res.statusCode = 200;
    res.end(JSON.stringify({
        name: 'Twilio SMS', 
        version: 1.0
    }));
});

app.post('/message', function(req, res) {
    var toNumber = req.body.toNumber;
    var message = req.body.message;

    if (toNumber == null) {
        res.statusCode = 400;
        res.json({error: 'no to number in toNumber field'});
        return;
    }

    if (message == null) {
        res.statusCode = 400;
        res.json({error: 'no message in message field'});
        return;
    }
    
    const client = require('twilio')(creds.accountSid, creds.authToken);

    // send an sms message with twilio
    client.messages
    .create({
        to: toNumber,
        from: creds.fromNumber,
        body: message
    })
    .then((recResponse) => console.log(recResponse.sid));
    res.json({
        "result":"success"
    })
});

app.listen(port, function(){console.log("app running")});
