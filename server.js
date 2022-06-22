// Bring in node packages
const express = require('express');
const path = require('path');
const fs = require('fs');

// Set up variable for express() function and port
const app = express();
const PORT = process.env.PORT || 3001;

// Add data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Had tutor help
// Set up routes 
app.get('public/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if(err) throw err;
        const notes = JSON.parse(data);

        // API routes
        app.get('/api/notes', (req, res) => {
            res.json(notes);
        });

        app.post('/api/notes', (req, res) => {
            const newNote = req.body;
            notes.push(newNote);
            dbTracker();
            return console.log('Note added ' + newNote.title);
        });

        // When we want to get a note at a specific id
        app.get('/api/notes/:id', (req, res) => {
            res.json(notes[req.params.id]);
        });

        // Where we are going to delete notes 
        app.delete('/api/notes/:id', (req, res) => {
            notes.splice(req.params.id, 1);
            dbTracker();
            console.log('Note deleted ' + req.params.id);
        });

        // Set up views to display html files 
        app.get('/notes', (req, res) => {
            res.sendFile(path.join(__dirname, '/public/notes.html'));
        });

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '/public/index.html'));
        });

        // Function to track notes added and deleted 
        const dbTracker = () => {
            fs.writeFile('db/db.json', JSON.stringify(notes, '\t'), err => {
                if(err) throw err;
                return true;
            });
        };

    });
});

// Listener goes at the bottom
app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});

