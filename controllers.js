const { devices, seenSerialNumbers, accessRequests } = require('./data');

const getAccessRequests = (request, response) => {
    response.send(accessRequests);
};

const getSeenSerialNumbers = (request, response) => {
    response.send(seenSerialNumbers);
};

const getDevices = (request, response) => {
    response.send(devices);
};

const createDeviceForm = (request, response) => {
    console.log(`URL: ${request.url}`);
    var form = `
    <form action="/api/devices/store" method="GET">
        <label for="name">Device Name:</label><br>
        <input type="text" id="device_name" name="device_name"><br>
        <label for="serial_number">Serial Number:</label><br>
        <select id="serial_number" name="serial_number">
            ${Object.keys(seenSerialNumbers).map((serial_number) => `<option value="${serial_number}">${serial_number}</option>`).join("")}
        </select><br>
        <input type="submit" value="Submit">
    </form>
    `;
    return response.send(form);
};
//get
const storeDevice = (request, response) => {
    const data = request.query;
    console.log(data);
    var device_name = data.device_name;
    var serial_number = data.serial_number;
    var new_device = {
        "id": devices.length + 1,
        "name": device_name,
        "serial_number": serial_number
    };
    devices.push(new_device);
    return response.send(request.query);
};

const getUpdates = (request, response) => {
    console.log(`URL: ${request.url}`);
    var serial_number = request.query.serial_number;
    seenSerialNumbers[serial_number] = new Date().getTime();
    return response.send(
        accessRequests.filter((item) => item.action_status == "pending")
    );
};

const sendUpdate = (request, response) => {
    console.log(`Body: ${JSON.stringify(request.body)}`);
    var action_id = request.body.action_id;
    var status = request.body.status;
    accessRequests.forEach((item) => {
        if (item.action_id == action_id) {
            item.action_status = status;
        }
    });
    return response.send({});
};

const getAccessRequestsBySerial = (request, response) => {
    console.log(`URL: ${request.url}`);
    var serial_number = request.query.serial_number;
    return response.send(
        accessRequests.filter((item) => item.serial_number == serial_number && item.action_name == "open" && item.action_status == "pending")
    );
};

const sendAccessRequest = (request, response) => {
    console.log(`Body: ${JSON.stringify(request.body)}`);
    var device_id = request.body.device_id;
    var device = devices.find((item) => item.id == device_id);
    var serial_number = device.serial_number;
    accessRequests.push({
        "action_id": 1,
        "serial_number": serial_number,
        "action_name": "open",
        "action_status": "pending",
    });
    return response.send({});
};

module.exports = {
    getAccessRequests,
    getSeenSerialNumbers,
    getDevices,
    createDeviceForm,
    storeDevice,
    getUpdates,
    sendUpdate,
    getAccessRequestsBySerial,
    sendAccessRequest
};