const express = require('express');
const Resturant = require('../models/restuarant')
const router = express.Router()



//Display resturant with their items.
router.get('/', async (req, res) => {
    try {
      const resturants = await Resturant.find().populate('itemID');
      res.json(resturants);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
})

//Search by keyword
router.get('/search/:name', async (req, res) => {
    try {
      var regex = new RegExp(req.params.name, 'i')
      product.find({name: regex}).then((result) => {
        res.json(result)
      })
      //res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
})

//Add resturants
  router.post('/add', async(req,res) => {
    const resturant = new Resturant({
       name: req.body.name,
       text: req.body.text,
       website: req.body.website,
       location: req.body.location,
       contact:req.body.contact,
       icon:req.body.icon,
       itemID:req.body.itemID
    })

    try{
       const x = await resturant.save()
       res.json(x)
    }catch(err){
       res.send('Error' + err)
    }
})

  module.exports = router
  