// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");

module.exports = function (app) {
    app.get("/notes", function (req, res) {
        // return the notes.html file
        res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    // If no matching route is found default to the index file
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
};
