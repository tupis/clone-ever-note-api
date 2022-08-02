const express = require('express');
const router = express.Router();
const Note = require('../models/notes');
const WithAuth = require("../middlewares/auth")

router.post('/', WithAuth, async (req, res) => {
    const { title, body } = req.body;
    
    try {
        let note = new Note({title, body, author: req.user._id})
        await note.save();
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({error: 'Problem to create a new note'})
    }
});

router.get('/', WithAuth, async (req, res) => {
    try {
        let allNotes = await Note.find({author: req.user._id})
        res.status(200).json(allNotes)
    } catch (error) {
        res.status(500).json({error})
    }
})

router.get('/search', WithAuth, async (req, res) => {
    const { query } = req.query;
    try {
        const notes = await Note
            .find({ author: req.user._id })
            .find({ title: query });
        res.json(notes)
    } catch (error) {
        res.status(500).json({error});
    }
})

router.get('/:userId', WithAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        let note = await Note.findById(userId);
        if(isOwner(req.user, note))
            res.json(note)
        else
            res.status(403).json({error: 'Permission Denied'})
    } catch (error) {
        res.status(500).json({error: 'Error to getting note'})
    }
})

router.put('/:id', WithAuth, async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body
    try {
        const note = await Note.findById(id)
        if(isOwner(req.user, note)){
            const note = await Note.findByIdAndUpdate(id, 
                { $set: {title, body} },
                { upsert: true, 'new': true }
            );
            res.json(note);
        }else {
            res.status(401).json({error: 'Permission Denied'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
})

router.delete('/:id', WithAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findById(id);
        if(isOwner(req.user, note)){
            const note = await Note.findByIdAndDelete(id);
            res.status(200).json({message: 'Nota excluída com sucesso'})
        }else{
            res.status(401).json({ error: 'Permission Denied'})
        }
    } catch (error) {
        res.status(500).json({error: 'Erro interno'})
    }
});

const isOwner = (user, note) => {
    if(JSON.stringify(user._id) == JSON.stringify(note.author)){
        return true
    } else {
        return false
    }
}

module.exports = router;