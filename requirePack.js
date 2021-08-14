// const express = require('express')
// const exphbs = require('express-handlebars')
// const methodOverride = require('method-override')
// const routes = require('./routes/index')
// const session = require('express-session')
// const usePassport = require('./config/passport')
// const flash = require('connect-flash')

module.exports = {
  express: require('express'),
  exphbs: require('express-handlebars'),
  methodOverride: require('method-override'),
  routes: require('./routes/index'),
  session: require('express-session'),
  usePassport: require('./config/passport'),
  flash: require('connect-flash')
}
