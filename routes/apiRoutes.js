var fs = require('fs');
const crypto = require('crypto');
const { log } = require('console');

// ===============================================================================
// ROUTING
// ===============================================================================

let noteData = [];

module.exports = function (app) {
    // API Requests
    // read the `db.json` file and return all saved notes as JSON
    app.get("/api/notes", function (req, res) {
        let dbContents = fs.readFileSync(__dirname + "/../db/db.json");
        noteData = JSON.parse(dbContents);
        res.send(noteData);
    });

    // Receive a new note to save on the request body
    app.post("/api/notes", function (req, res) {
        let newNote = req.body;
        // assign the note a unique id
        newNote.id = crypto.randomBytes(8).toString("hex");

        // add it to the `db.json` file
        noteData.push(newNote);
        fs.writeFileSync(__dirname + "/../db/db.json", JSON.stringify(noteData), "UTF8");

        // return the new note to the client.
        res.send(newNote);
    });

    // receive a query parameter containing the id of a note to delete. 
    app.delete("/api/notes/:id", function (req, res) {
        // remove the note with the given id 
        noteData = noteData.filter((item) => {
            return item.id !== req.params.id;
        });

        // rewrite the notes to the `db.json` file.
        fs.writeFileSync(__dirname + "/../db/db.json", JSON.stringify(noteData), "UTF8");

        res.json({ ok: true });
    });
};
