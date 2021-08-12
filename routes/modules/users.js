const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      } else {
        return User.create({
          name,
          email,
          password
        })
          .then(() => res.render('login'))
          .catch(error => console.log(error))
      }
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('login') // 使用render會使的在登出後isAuthenticated仍為true，因為沒在讓登出後的狀態在跑一次路由
})

module.exports = router
