const fs = require('fs');
const crypto = require('crypto');
const e = require('express');

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

        if (!newNote.title || !newNote.text) {
            // incomplete input data so return error
            return res.status(400).json({ msg: 'Please include a title and text for the note' });
        }

        // valid data so add it to the `db.json` file
        noteItems.push(newNote);
        fs.writeFileSync(__dirname + "/../db/db.json", JSON.stringify(noteItems), "UTF8");

        // return the new note 
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
                // send error code with message
                return res.status(400).json({ msg: `no note with id (${updateNote.id}) found` });
            }
        } else {
            // send error code with message
            return res.status(400).json({ msg: 'no id provided' });
        }
    });

    // receive a query parameter containing the id of a note to delete. 
    app.delete("/api/notes/:id", function (req, res) {
        if (noteItems.some(item => item.id === req.params.id)) {
            // remove the note with the given id from the array
            noteItems = noteItems.filter((item) => {
                return item.id !== req.params.id;
            });

            // rewrite the notes to the `db.json` file.
            fs.writeFileSync(__dirname + "/../db/db.json", JSON.stringify(noteItems), "UTF8");

            // set res and return the updated array
            res.json({
                msg: `note with id (${req.params.id}) successfully deleted`,
                members: noteItems
            });
        }
        else {
            // send error code with message
            res.status(400).json({ msg: `no note with id (${req.params.id}) found` });
        }
    });
};
