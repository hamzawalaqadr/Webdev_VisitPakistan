const express = require('express')
const Item = require('../models/item')
const Restuarant = require('../models/restuarant')
const router = express.Router()

//Display
router.get('/', async(req,res) => {
    try{
        const items = await Item.find()
        res.json(items)
    }catch(err){
        res.send('Error ' + err)
    }
})

//Search all resturants for a given item
router.get('/:itemId', async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const restuarant = await Restuarant.find({ itemId }).populate('itemId');
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
})

// Add items
router.post('/add', async (req, res) => {
    // Create a new item based on the incoming request body
    const item = new Item({
        calorieCount: req.body.calorieCount,
        items: req.body.items
    });

    try {
        const savedItem = await item.save();
        res.json(savedItem);
    } catch (err) {
        res.status(400).send('Error: ' + err);
    }
});



module.exports = router