const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required.'],
        unique: true,
        trim: true,
        minlength: [3, 'Category name must be at least 3 characters long.'],
        maxlength: [50, 'Category name must not exceed 50 characters.'],

    },
    slug: {
        type: String,
        required: [true, 'Slug is required.'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    parent: {
        type: mongoose.Schema.ObjectId||null,
        ref: 'Category',
        required: false,
        default: null,
    },
    description: {
        type: String,
        maxlength: [150, 'Description must not exceed 150 characters.'],
        trim: true,
    },
});

module.exports = mongoose.model('Category', CategorySchema);
