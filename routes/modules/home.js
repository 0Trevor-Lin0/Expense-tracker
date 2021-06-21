const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/', (req, res) => {
  let totalAmount = 0
  return Record.find()
    .lean()
    .sort('_id')
    .then(records => {
      Category.find()
        .lean()
        .then(categories => {
          records.forEach(record => {
            categories.find(category => {
              if (record.category === category.name) {
                record.icon = category.icon
              }
            })
            record.date = record.date.toDateString() // 改變取出date呈現方式
            totalAmount += record.amount
          })
          res.render('index', { records, totalAmount })
        })
    })

    .catch(error => console.log(error))
})

module.exports = router
