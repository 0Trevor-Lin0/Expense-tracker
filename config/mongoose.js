const mongoose = require('mongoose')
// Make Mongoose use `findOneAndRemove()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false)

mongoose.connect('mongodb://localhost/Expense', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db
