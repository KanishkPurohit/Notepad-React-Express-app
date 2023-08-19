const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route1 : get all the notes using GET " api/notes/getallnotes" . Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" internal server error occured");
  }
});
//Route2 : add a new  notes using POST " api/notes/adddnote" . login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "pass must be alteast 5 caracters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are erros , return badrequest andthe errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(" internal server error occured");
    }
  }
);

//Route 3 : update a existing note using PUT " api/notes/updatenote" . login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //create a newnote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //find the note to be updated and updated it
    let note = await Notes.findById(req.params.id); //same id given at url
    if (!note) {
      res.status(404).send("not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" internal server error occured");
  }
});

//Route 4 : delete a existing note using DELETE " api/notes/deletenote" . login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    //verify the note belongs to the person who is deleting it

    //find the note to be deleted and deleted it
    let note = await Notes.findById(req.params.id); //same id given at url
    if (!note) {
      res.status(404).send("not found");
    }

    // Allow deleltion if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ "success ": "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" internal server error occured");
  }
});
module.exports = router;
