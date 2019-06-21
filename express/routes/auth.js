const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const AuthController = require('../controllers/auth')

function isAuthenticated(req, res, next) {
  if (!req.cookies.id_token) {
    return res.status(401).send('Unauthorized')
  }
  const payload = jwt.verify(req.cookies.id_token, "senpai")
  req.user = payload._doc
  return next()
}

router.put('/user', isAuthenticated, (req, res) => {
  AuthController.UpdateUser(req.user, req.body.userName)
    .then(() => res.send('User updated'))
})

router.put('/password', isAuthenticated, (req, res) => {
  AuthController.UpdatePassword(req.user, req.body.password)
    .then(() => res.send('Password updated'))
})

router.post('/signup', (req, res) => {
  AuthController.SignUp(req.body)
    .then(() => res.send('User created successfully'))
    .catch(err => res.status(400).send(err))
})

router.post('/login', (req, res) => {
  AuthController.Login(req.body)
    .then((result) => {
      if (!result) return res.status(404).send('No user found')
      const token = jwt.sign({ ...result }, "senpai")
      return res.send(token)
    })
})

module.exports = router