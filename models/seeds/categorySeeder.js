const db = require('../../config/mongoose')
const Category = require('../category')
const { categorySeed } = require('../../categorySeed.json')

db.once('open', () => {
  console.log('mongodb connected!')
  Category.create(categorySeed)
    .then(() => {
      console.log('create done')
      return db.close()
    }).then(() => {
      console.log('database connection close...')
    })
})
