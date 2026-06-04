const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    color: { type: String, default: '#4136fd'},
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    completions: { type: [Date], default: [] }
}, { timestamps: true })

module.exports = mongoose.model('Habit', habitSchema)