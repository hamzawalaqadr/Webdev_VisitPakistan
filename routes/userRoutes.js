const express = require('express')
const router = express.Router()
const User = require('../models/User')
const {verifyAccessToken} = require('../middleware/jwtHelper')

router.get('/', verifyAccessToken, async(req,res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch(err){
        res.send('Error ' + err)
    }
})

router.post('/add', verifyAccessToken, async(req,res) => {
     const user = new User({
        name: req.body.name,
        email: req.body.email
     })

     try{
        const x = await user.save()
        res.json(x)
     }catch(err){
        res.send('Error' + err)
     }
})

//To update any field
router.put('/:id', verifyAccessToken, async(req, res, next) => {
        const id = req.params.id
        const updateOps = {}
        for (const ops of req.body){
            updateOps[ops.propName]=ops.value;
        }
        User.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result)
            res.json(result)
        })
        .catch(err => {
            console.log(err)
            res.json({error: err})
        })
})


module.exports = router