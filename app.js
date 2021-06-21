const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes/index')
// 建立mongoose 與 mongodb連結
// 引入路由器

const app = express()
const port = process.env.PORT || 3000
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: '.handlebars' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
  console.log(`the app is running on localhost:${port}`)
})
