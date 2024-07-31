const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Import routes
const routes = require('./routes');
app.use(routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});