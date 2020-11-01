const fs = require('fs');
const crypto = require('crypto');
const { log } = require('console');

// ===============================================================================
// ROUTING
// ===============================================================================

let noteItems = [];

module.exports = function (app) {
    // API Requests
    // read the `db.json` file and return all saved notes as JSON
    app.get("/api/notes", function (req, res) {
        let dbContents = fs.readFileSync(__dirname + "/../db/db.json");
        noteItems = JSON.parse(dbContents);
        res.send(noteItems);
    });

    // Receive a new note to save on the request body
    app.post("/api/notes", function (req, res) {
        let newNote = req.body;
        // assign the note a unique id
        newNote.id = crypto.randomBytes(8).toString("hex");

        // add it to the `db.json` file
        noteItems.push(newNote);
        fs.writeFileSync(__dirname + "/../db/db.json", JSON.stringify(noteItems), "UTF8");

        // return the new note to the client.
        res.send(newNote);
    });

    // Receive a note to update on the request body
    app.put("/api/notes", function (req, res) {
        let updateNote = req.body;

        //only continue with update if the id is valid
        if (updateNote.id) {
            let savedNote = noteItems.find(({ id }) => { return id === updateNote.id })

            if (savedNote) {

                // add it to the `db.json` file
                savedNote.title = updateNote.title;
                savedNote.text = updateNote.text;

                fs.writeFileSync(__dirname + "/../db/db.json", JSON.stringify(noteItems), "UTF8");

                // return the new note to the client.
                res.send(updateNote);

            } else {
                res.json({ ok: false, result: 'no note with provided id found' });
            }
        } else {
            res.json({ ok: false, result: 'id not sent' });
        }
    });

    // receive a query parameter containing the id of a note to delete. 
    app.delete("/api/notes/:id", function (req, res) {
        // remove the note with the given id 
        noteItems = noteItems.filter((item) => {
            return item.id !== req.params.id;
        });

        // rewrite the notes to the `db.json` file.
        fs.writeFileSync(__dirname + "/../db/db.json", JSON.stringify(noteItems), "UTF8");

        res.json({ ok: true });
    });
};
