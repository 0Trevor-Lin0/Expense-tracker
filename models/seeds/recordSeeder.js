// 使得mongoose能取得.env的path
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')
// 建立種子前要取得資料庫連線
const db = require('../../config/mongoose')
// 取得Schema
const Record = require('../record')
const Category = require('../category')
const User = require('../user')
// 取得預設seedData
const { recordSeed } = require('./recordSeed.json')
const { userSeed } = require('./userSeed.json')

db.once('open', () => {
  console.log('mongodb connected!')
  const { name, email, password } = userSeed
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hash => User.create({
      name,
      email,
      password: hash
    }))
    .then(user => {
      Category.find()
        .lean()
        .then(categories => {
          return Promise.all(Array.from(recordSeed, (record, i) => {
            const category = categories.find(category => category.name === record.category)
            record.categoryId = category._id
            record.userId = user._id
          }))
        })
        .then(() => Record.create(recordSeed))
        .then(() => {
          console.log('create done')
          return db.close()
        })
    })
})
