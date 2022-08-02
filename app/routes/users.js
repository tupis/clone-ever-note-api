const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");

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

router.delete('/delete', async (req, res) => {
  try {
    await User.findByIdAndDelete('62e96381ff82e88f5bc12c6b')
    const allUsers = await User.find({})
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(500).json({error: "Erro ao excluir usuário"})
  }
})

module.exports = router;
