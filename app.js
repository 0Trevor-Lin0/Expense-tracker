const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
// 建立mongoose 與 mongodb連結
// 引入路由器

const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: '.handlebars' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`the app is running on localhost:${port}`)
})
