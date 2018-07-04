'use strict';

let request = require("request");

// populate environment variables locally.
require('dotenv').config();

// Handle the lambda invocation
exports.handler = function(event, context, callback) {

    // check auth
    let queryStringParameters = event.queryStringParameters;
    if (queryStringParameters["VECTRONIC_FUNCTION_AUTH"] !== process.env.VECTRONIC_FUNCTION_AUTH) {
        console.log("VECTRONIC_FUNCTION_AUTH query param incorrect");
        return;
    }

    // get the arguments from the notification
    let body = JSON.parse(event.body);

    // prepare call to the Sendinblue API
    let sendinblueURL = 'https://api.sendinblue.com/v3/contacts';
    let sendinbluePayload = {
        'listIds': [parseInt(process.env.SENDINBLUE_LIST_ID)],
        'email': body.data.email,
        'attributes': {
            'FIRSTNAME': body.data.first_name,
            'LASTNAME': body.data.last_name
        }
    };

    let headers = {
        'content-type': 'application/json',
        'api-key': process.env.SENDINBLUE_API_AUTH
    };

    // post the notification to Send In Blue
    request.post({url:sendinblueURL, json: sendinbluePayload, headers: headers}, function(err, httpResponse, body) {
        let msg;
        if (err) {
            msg = 'Post to Sendinblue failed:' + err;
        }
        else {
            msg = 'Post to Sendinblue successful!  Server responded with:' + body;
        }
        callback(null, {
            statusCode: 200,
            body: msg
        });
        return console.log(msg);
    });
};