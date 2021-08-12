const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Record = require('../../models/record')
const mongoose = require('mongoose')

router.get('/', (req, res) => {
  let totalAmount = 0
  const userId = req.user._id
  return Record.find({ userId })
    .lean()
    .sort('-date')
    .then(records => {
      Category.find()
        .lean() // 使用lean()後ObjectId就會變成單純的值?
        .then(categories => {
          records.forEach(record => {
            categories.forEach(category => {
              // 要字串化不然沒辦法true
              if (String(record.categoryId) === String(category._id)) {
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
  const userId = req.user._id
  const categoryId = mongoose.Types.ObjectId(req.body.categoryId)
  let totalAmount = 0
  console.log('filter categoryId:', typeof categoryId)
  return Record.aggregate([{ $match: { categoryId, userId } }])
    .sort('-date')
    .then(records => {
      console.log('records filter data', records)
      Category.find()
        .lean()
        .then(categories => {
          records.forEach(record => {
            categories.forEach(category => {
              if (String(record.categoryId) === String(category._id)) {
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
