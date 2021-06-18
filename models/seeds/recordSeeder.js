const db = require('../../config/mongoose') // 建立種子前要取得資料庫連線
const Record = require('../record')
const { recordSeed } = require('../../recordSeed.json')

db.once('open', () => {
  console.log('mongodb connected!')
  Record.create(recordSeed)
    .then(() => {
      console.log('create done')
      return db.close()
    }).then(() => {
      console.log('database connection close...')
    })
})
