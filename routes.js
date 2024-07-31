const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Define routes
router.get("/api/accessRequests", controllers.getAccessRequests);
router.get("/api/seenSerialNumbers", controllers.getSeenSerialNumbers);
router.get("/api/devices", controllers.getDevices);
router.get("/api/devices/create", controllers.createDeviceForm);
router.get("/api/devices/store", controllers.storeDevice);
router.get("/api/getUpdates", controllers.getUpdates);
router.post("/api/sendUpdate", controllers.sendUpdate);
router.get("/api/getAccessRequests", controllers.getAccessRequestsBySerial);
router.post("/api/sendAccessRequest", controllers.sendAccessRequest);

module.exports = router;