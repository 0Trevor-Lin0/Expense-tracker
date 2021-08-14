const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
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
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password.length < 6 || password.length > 16) {
    errors.push({ message: '密碼長度要6至16字元之間！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！只能輸入英文與數字！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        req.flash('warningMsg', '此email已經註冊過囉！')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/'))
        .then(error => console.log(error))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('successMsg', '你已經成功登出。')
  res.redirect('login') // 使用render會使得在登出後isAuthenticated仍為true，因為沒在讓登出後的狀態在跑一次路由
})

module.exports = router
