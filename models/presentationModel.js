const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PresentationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }
});

module.exports = mongoose.model('Presentation', PresentationSchema);