// Bring in node packages
const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('./db/db.json');

// Set up variable for express() function and port
const app = express();
const PORT = process.env.PORT || 3001;

// Add data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API routes
app.get('/api/notes', (req, res) => {
    res.json(noteData.slice(1));
});

app.post('/api/notes', (req, res) => {
    const newNote = addNote(req.body, noteData);
    res.json(addNote);
});

// When we want to get a note at a specific id
app.get('/api/notes/:id', (req, res) => {
    res.json(notes[req.params.id]);
});

// Where we are going to delete notes 
app.delete('/api/notes/:id', (req, res) => {
    dbTracker(req.params.id, noteData);
    res.json(true);
});

// Set up views to display html files 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Function to add notes 
const addNote = (body, noteArray) {
    const newNote = body;
    if(!Array.isArray(noteArray))
    noteArray = [];

    if(noteArray.length === 0)
    noteArray[0]++;

    noteArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/dbljson'),
        JSON.stringify(noteArray, null, 2)
    );
    return newNote;
}

// Function to track notes added and deleted 
const dbTracker = (id, noteArray) => {
    for(let i = 0; i < notes.length; i++) {
        if (notes[i].id == id) {
            notes.splice(i, 1);
            //short circuit the loop, since there will only be one match on ID
            break;
        }
    }

};


// Listener goes at the bottom
app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});

