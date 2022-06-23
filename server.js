// Pull in needed mods and files
const express = require('express');
const fs = require('fs');
const path = require('path');
const noteDb = require('./db/db.json');

// Create variable for express function and PORT
const app = express();
const PORT = process.env.PORT || 3001;

// Parsing data
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET functions for pathing and APIs
app.get('/api/notes', (req, res) => {
    res.json(noteDb.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Function to add notes 
const addNote = (body, noteData) => {
    const newNote = body;

    if (!Array.isArray(noteData))
        noteData = [];
    
    if (noteData.length === 0)
        noteData.push(0);

    body.id = noteData[0];
    noteData[0]++;

    noteData.push(newNote);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(noteData, null, 2)
    );

    return newNote;
};

// Post where addNote function will be called 
app.post('/api/notes', (req, res) => {
    const newNote = addNote(req.body, noteDb);
    res.json(newNote);
});

// Function to delete notes 
const deleteNote = (id, noteData) => {
    for (let i = 0; i < noteData.length; i++) {
        let note = noteData[i];

        if (note.id == id) {
            noteData.splice(i, 1);

            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(noteData, null, 2)
            );

            break;
        }
    }
};

// Delete where deleteNote function will be called 
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, noteDb);
    res.json(true);
});

// Listeners go at the bottom and listen for connections
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

