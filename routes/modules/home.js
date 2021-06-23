const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/', (req, res) => {
  let totalAmount = 0
  return Record.find()
    .lean()
    .sort('-date')
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
          res.render('index', { records, totalAmount, categories })
        })
    })

    .catch(error => console.log(error))
})

router.post('/filter', (req, res) => {
  let totalAmount = 0
  const category = req.body.category
  console.log(category)
  return Record.aggregate([{ $match: { category: category } }])
    .sort('-date')
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
          res.render('index', { records, totalAmount, categories })
        })
    })
    .catch(error => console.log(error))
})

module.exports = router
