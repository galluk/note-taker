// ==============================================================================
// Set npm packages that will be used to give the server useful functionality
// ==============================================================================

let express = require("express");

// ==============================================================================
// Sets up the basic properties for the express server
// ==============================================================================

// Tells node that we are creating an "express" server
let app = express();

// Sets an initial port.
let PORT = process.env.PORT || 8000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// allow the server to serve up static files within the public folder
app.use(express.static('public'));

// ================================================================================
// ROUTER
// Point the server to the required "route" files.
// ================================================================================

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// =============================================================================
// LISTENER
// Start the  server
// =============================================================================

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});
