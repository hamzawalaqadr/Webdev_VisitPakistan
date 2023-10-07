const mongoose = require('mongoose');

const subItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isMB: {
        type: Boolean,
        required: true
    }
}, { _id: false }); 

const itemSchema = new mongoose.Schema({
    calorieCount: {
        type: String,
        enum: ['400 Calorie Meals', '500 Calorie Meals', '600 Calorie Meals', '700 Calorie Meals', '800 Calorie Meals'],
        required: true
    },
    items: [subItemSchema]
});

module.exports = mongoose.model('Item', itemSchema);
