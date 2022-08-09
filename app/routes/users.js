const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const WithAuth = require('../middlewares/auth');

const secret = process.env.JWT_TOKEN

router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  try {
    let user = new User({name, email, password})
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({error: 'Error registering new user!'})
  }
})

router.post('/login', async (req, res) => {
  const{ email, password } = req.body;
  try {
    let user = await User.findOne({ email })
    if(!user){
      res.status(401).json({error: "usuário incorreto"})
    } else {
      user.isCorrectPassword(password, function(err, same){
        if(!same){
          res.status(401).json({error: "senha incorreta"})
        } else {
          const token = jwt.sign({email}, secret, {expiresIn: '1d'})
          res.status(200).json({user, token})
        }
      })
    }
  } catch (error) {
    res.status(500).json({error: 'Erro interno, tente novamente'})
  }
})

router.get('/all', async (req, res) => {
  try {
    const allUsers = await User.find({})
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(500).json({error: 'Ao achar usuário'})
  }
})

router.put('/', WithAuth, async (req, res) => {
  const {name, email} = req.body;

  try {
    let user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: {name, email} },
      { upsert: true, 'new': true }
    )
    res.status(200).json(user)
  } catch (error) {
    res.status(401).json({error})
  }
})

router.put('/password', WithAuth, async (req, res) => {
  const { password } = req.body;
  try {
    let user = await User.findByIdAndUpdate(req.user._id,)
    user.password = password
    await user.save();
    res.json(user)
  } catch (error) {
    res.status(401).json(error)
  }
})

router.delete('/', WithAuth, async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.user._id);
    res.status(200).json({message: 'User deleted successfully'})
  } catch (error) {
    
  }
})

module.exports = router;
