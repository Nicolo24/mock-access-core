//import express from 'express';
const express = require('express');

// Create an express application
const app = express();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Define the port
const PORT = process.env.PORT || 8000;

// Create empty dictionary to store the data
const data = {};

// Create empty list to store the access requests
const accessRequests = [];

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Define the routes
app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

//Route POST for /api/v1/<token>/telemetry
app.post("/api/v1/:token/telemetry", (request, response) => {
    const token = request.params.token;
    const body = request.body;

    //log all the data
    console.log(`Token: ${token}`);
    console.log(`Body: ${JSON.stringify(body)}`);

    data[token] = {
        "last_seen": new Date(),
        "data": body
    };

    response.send({
        "token": token,
        "body": body
    });
});

//Route GET for /api/v1/devices

app.get("/api/v1/devices", (request, response) => {
    response.send(data);
});

app.get("/api/accessRequests", (request, response) => {
    response.send(accessRequests);
}
);

//Route GET for /api/getUpdates
app.get("/api/getUpdates", (request, response) => {
    //log the url with query parameters
    console.log(`URL: ${request.url}`);
    //send accessRequests where action_name is equal to "open"

    return response.send(
        accessRequests.filter((item) => item.action_status == "pending")
    );
});

//Route POST for /api/sendUpdate
app.post("/api/sendUpdate", (request, response) => {
    //log the body
    console.log(`Body: ${JSON.stringify(request.body)}`);
    var_action_id = request.body.action_id;
    var_status = request.body.status;
    //update the accessRequests list with the new data
    accessRequests.forEach((item, index) => {
        if (item.action_id == var_action_id) {
            item.action_status = var_status;
        }
    });
    return response.send({});
});


//Route POST for /api/sendAccessRequest
app.post("/api/sendAccessRequest", (request, response) => {
    //log the body
    console.log(`Body: ${JSON.stringify(request.body)}`);
    
    accessRequests.push(
        {
            "action_id":1,
            "action_name":"open",
            "action_status":"pending",
        }
    );
    return response.send({});
});