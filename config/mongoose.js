const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI
// Make Mongoose use `findOneAndRemove()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db
