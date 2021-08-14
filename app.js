if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const requirePack = require('./requirePack')
const app = requirePack.express()
const port = process.env.PORT

// 建立mongoose 與 mongodb連結
require('./config/mongoose')

app.engine('handlebars', requirePack.exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(
  requirePack.session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  }),
  // setting static files
  requirePack.express.static('public'),
  requirePack.express.urlencoded({ extended: true }),
  // 設定 methodOverride 進行前置處理
  requirePack.methodOverride('_method'),
  requirePack.flash()
)

requirePack.usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.successMsg = req.flash('successMsg')
  res.locals.warningMsg = req.flash('warningMsg')
  next()
})
app.use(requirePack.routes)

app.listen(port, () => {
  console.log(`the app is running on localhost:${port}`)
})
