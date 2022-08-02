const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Note', noteSchema);