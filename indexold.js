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

// Create empty list to store the devices
const devices = [];

// Create empty dictionary to store the seen serial_numbers
const seenSerialNumbers = {};

// Create empty list to store the access requests
const accessRequests = [];

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get("/api/accessRequests", (request, response) => {
    response.send(accessRequests);
}
);

// Route GET for /api/seenSerialNumbers
app.get("/api/seenSerialNumbers", (request, response) => {
    response.send(seenSerialNumbers);
}
);

// Route GET for /api/devices
app.get("/api/devices", (request, response) => {
    response.send(devices);
}
);

app.get("/api/devices/create", (request, response) => {
    //log the url
    console.log(`URL: ${request.url}`);
    //create a form with input fields for device name and select dropdown for serial number
    var form = `
    <form action="/api/devices/store" method="post">
        <label for="name">Device Name:</label><br>
        <input type="text" id="name" name="device_name"><br>
        <label for="serial_number">Serial Number:</label><br>
        <select id="serial_number" name="serial_number">
            ${Object.keys(seenSerialNumbers).map((serial_number) => `<option value="${serial_number}">${serial_number}</option>`).join("")}
        </select><br>
        <input type="submit" value="Submit">
    </form>
    `;
    //send the form as response
    return response.send(form);
});

//code for /api/devices/store
app.post("/api/devices/store", (request, response) => {
    //log the body
    console.log(`Body: ${JSON.stringify(request.body)}`);
    //get device name and serial number from body
    var device_name = request.body.device_name;
    var serial_number = request.body.serial_number;
    //create new device object with unique id, device name and serial number
    var new_device = {
        "id": devices.length + 1,
        "name": device_name,
        "serial_number": serial_number
    };
    //add new device to devices list
    devices.push(new_device);
    //send the body as response
    return response.send(request.body);
});

//Route GET for /api/getUpdates
app.get("/api/getUpdates", (request, response) => {
    //log the url with query parameters
    console.log(`URL: ${request.url}`);

    //get serial number from query parameters
    var serial_number = request.query.serial_number;

    //creaate new object in seenSerialNumbers dictionary with key as serial_number and value as current time
    seenSerialNumbers[serial_number] = new Date().getTime();

    //send accessRequests where action_name is equal to "open" and action_status is equal to "pending"

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

//Route GET for /api/getAccessRequests
app.get("/api/getAccessRequests", (request, response) => {
    //log the url with query parameters
    console.log(`URL: ${request.url}`);

    //get serial number from query parameters
    var serial_number = request.query.serial_number;

    //send accessRequests where action_name is equal to "open" and action_status is equal to "pending"
    return response.send(
        accessRequests.filter((item) => item.serial_number == serial_number && item.action_name == "open" && item.action_status == "pending")
    );
});


//Route POST for /api/sendAccessRequest
app.post("/api/sendAccessRequest", (request, response) => {
    //log the body
    console.log(`Body: ${JSON.stringify(request.body)}`);
    //get device_id from body
    var device_id = request.body.device_id;
    var device = devices.find((item) => item.id == device_id);
    serial_number = device.serial_number;
    //create new object in accessRequests list with action_name as "open" and action_status as "pending"
    accessRequests.push(
        {
            "action_id": 1,
            "serial_number": serial_number,
            "action_name": "open",
            "action_status": "pending",
        }
    );
    return response.send({});
});