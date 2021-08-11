const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes/index')
const app = express()
const session = require('express-session')
const usePassport = require('./config/passport')
const port = process.env.PORT || 3000
// 建立mongoose 與 mongodb連結
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'expenseSecret',
  resave: false,
  saveUninitialized: true
}))

// setting static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
// 設定 methodOverride 進行前置處理
app.use(methodOverride('_method'))
usePassport(app)
app.use(routes)

app.listen(port, () => {
  console.log(`the app is running on localhost:${port}`)
})
