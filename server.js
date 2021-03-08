//require all dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//direct user to correct page depending on url
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});
app.get("/notes", (req, res) => {
   res.sendFile(path.join(__dirname, "./public/notes.html"))
});

//send json of all notes if user accesses api/notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
      if (error) {
          return console.log(error)
      }
      console.log(notes)
      res.json(JSON.parse(notes))
  })
});

//use POST method to bring user input to backend
app.post("/api/notes", (req, res) => {
    //declare const for the note currently being saved by user
    const currentNote = req.body;
    //retrieve notes from db.json, get id of last note, add 1 to it to create 
    //new id, save current note with new id
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
      if (error) {
          return console.log(error)
      }
      notes = JSON.parse(notes)
      let lastId = notes[notes.length - 1].id
      let id =  parseInt(lastId)+ 1
 
      //create new note object
      let newNote = { 
        title: currentNote.title, 
        text: currentNote.text, 
        id: id 
        }

      var newNotesArr = notes.concat(newNote)

      fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesArr), (error, data) => {
        if (error) {
          return error
        }
        console.log(newNotesArr)
        res.json(newNotesArr);
      })
  });
 
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
