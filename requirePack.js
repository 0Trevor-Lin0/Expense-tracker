module.exports = {
  express: require('express'),
  exphbs: require('express-handlebars'),
  methodOverride: require('method-override'),
  routes: require('./routes/index'),
  session: require('express-session'),
  usePassport: require('./config/passport'),
  flash: require('connect-flash')
}
