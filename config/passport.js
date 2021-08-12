const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('warningMsg', '此電子郵件尚未註冊'))
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('warningMsg', '電子郵件或密碼不正確'))
            }
            return done(null, user)
          })
      })
      .catch(error => done(error, false))
  }))
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    console.log('serializeUser')
    done(null, user.id)
  })
  passport.deserializeUser((_id, done) => {
    User.findById(_id)
      .lean()
      .then(user => {
        console.log('deserializeUser')
        done(null, user)
      })
      .catch(error => done(error, null))
  })
}
