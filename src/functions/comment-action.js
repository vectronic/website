'use strict';

let request = require("request");

// populate environment variables locally.
require('dotenv').config();


// delete this submission via the api
function purgeComment(id) {
    let url = `https://api.netlify.com/api/v1/submissions/${id}?access_token=${process.env.NETLIFY_API_AUTH}`;
    request.delete(url, function(err, response, body) {
        if (err) {
            return console.log(err);
        }
        else {
            return console.log("Comment deleted from queue.");
        }
    });
}


// Handle the lambda invocation
exports.handler = function(event, context, callback) {

    // parse the payload
    let body = event.body.split("payload=")[1];
    let payload = JSON.parse(unescape(body));
    console.log(payload);

    let method = payload.actions[0].name;
    console.log(method);
    let id = payload.actions[0].value;

    if (method === "delete") {
        purgeComment(id);
        callback(null, {
            statusCode: 200,
            body: "Comment deleted"
        });
    }
    else if (method === "approve") {

        // get the comment data from the queue
        let url = `https://api.netlify.com/api/v1/submissions/${id}?access_token=${process.env.NETLIFY_API_AUTH}`;

        console.log("Getting from", approvedURL);

        request(url, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                let data = JSON.parse(body).data;

                // now we have the data, let's massage it and post it to the approved form
                let payload = {
                    'form-name' : "approved-comments",
                    'path': data.path,
                    'received': new Date().toString(),
                    'email': data.email,
                    'first-name': data.first-name,
                    'last-name': data.last-name,
                    'comment': data.comment
                };
                let approvedURL = process.env.URL;

                console.log("Posting to", approvedURL);
                console.log(payload);

                // post the comment to the approved lost
                request.post({'url':approvedURL, 'formData': payload }, function(err, httpResponse, body) {
                    let msg;
                    if (err) {
                        msg = 'Post to approved comments failed:' + err;
                        console.log(msg);
                    } else {
                        msg = 'Post to approved comments list successful.';
                        console.log(msg);
                        purgeComment(id);
                    }
                    msg = "Comment registered.";
                    callback(null, {
                        statusCode: 200,
                        body: msg
                    });
                    return console.log(msg);
                });
            }
        });
    }
};
