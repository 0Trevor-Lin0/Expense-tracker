const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes/index')
// 建立mongoose 與 mongodb連結

const app = express()
const port = process.env.PORT || 3000
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: '.handlebars' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
// 設定 methodOverride 進行前置處理
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, () => {
  console.log(`the app is running on localhost:${port}`)
})
