import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props)=>{
  const host = "http://localhost:5000"
    const notesInitial = []

      const [notes, setNotes] = useState(notesInitial)
      //Get all notes
      const getNotes = async ()=>{
        // Api call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRlMGI5ZTY0NDk5YjRiNjIyZjZiNDYzIn0sImlhdCI6MTY5MjQ1MzE0M30.d7M5Ixo9xkpVJADsxXDO6fPbliIlypxQHqoSDHDAA9E"
          },
          
        });
        const json = await response.json()
        setNotes(json);
      }
      //Add a note
      const addNote = async (title,description,tag)=>{
      // Api
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRlMGI5ZTY0NDk5YjRiNjIyZjZiNDYzIn0sImlhdCI6MTY5MjQ1MzE0M30.d7M5Ixo9xkpVJADsxXDO6fPbliIlypxQHqoSDHDAA9E"
        },
        body: JSON.stringify(title , description , tag),
      });
       const json = await response.json();
       console.log(json);
      // 
        const note =  {
          "_id": "64e20ce2ba85abec62da2a54",
          "user": "64e0b9e64499b4b622f6b463",
          "title": title,
          "description": description,
          "tag": tag,
          "date": "2023-08-20T12:53:54.964Z",
          "__v": 0
        };
        setNotes(notes.concat(note))
      }
      //Delete a note
      const deleteNote = async (id)=>{
        //API call 
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRlMGI5ZTY0NDk5YjRiNjIyZjZiNDYzIn0sImlhdCI6MTY5MjQ1MzE0M30.d7M5Ixo9xkpVJADsxXDO6fPbliIlypxQHqoSDHDAA9E"
          },
        });
        const json =await response.json();
        console.log(json);

       const newNotes = notes.filter((note)=>{return note._id !== id})
        setNotes(newNotes);

      }
      //Edit a note
      const editNote =async (id , title , description , tag)=>{
        //API call
        
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRlMGI5ZTY0NDk5YjRiNjIyZjZiNDYzIn0sImlhdCI6MTY5MjQ1MzE0M30.d7M5Ixo9xkpVJADsxXDO6fPbliIlypxQHqoSDHDAA9E"
          },
          body: JSON.stringify({title,description,tag}),
        });
        const json = await response.json();
        console.log(json);

        let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if (element._id === id) {
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
          }
        }
        setNotes(newNotes);
      }

    return (
        <NoteContext.Provider value={{notes  ,addNote ,deleteNote , editNote ,getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}
export default NoteState;