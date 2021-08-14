const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Record = require('../../models/record')
const mongoose = require('mongoose')

router.get('/', (req, res) => {
  const userId = req.user._id
  return Record.find({ userId })
    .lean()
    .sort('-date')
    .then(records => {
      Category.find()
        .lean()
        .then(categories => {
          records.forEach(record => {
            categories.forEach(category => {
              // 物件 !== 物件，要字串化不然沒辦法true
              if (String(record.categoryId) === String(category._id)) {
                record.icon = category.icon
              }
            })
            record.date = record.date.toDateString() // 改變取出date呈現方式
          })
          const totalAmount = records.reduce((price, record) => {
            price += record.amount
            return price
          }, 0)
          Record.aggregate([{ $group: { _id: '$category', total: { $sum: '$amount' } } }])
            .then(categoryAmount =>
              res.render('index', { records, totalAmount, categories, categoryAmount })
            )
        })
    })

    .catch(error => console.log(error))
})

router.post('/filter', (req, res) => {
  const userId = req.user._id
  // 如果未使用就給定null讓$match中的yearMonth失效
  const categoryId = req.body.categoryId ? mongoose.Types.ObjectId(req.body.categoryId) : { $ne: '' }
  const yearMonth = req.body.yearMonth || { $ne: '' }
  return Record.aggregate([
    {
      $project: {
        name: 1,
        date: 1,
        amount: 1,
        category: 1,
        merchant: 1,
        categoryId: 1,
        userId: 1,
        yearMonth: { $dateToString: { format: '%Y-%m', date: '$date' } }
      }
    },
    { $match: { categoryId, userId, yearMonth } }
  ])
    .sort('-date')
    .then(records => {
      Category.find()
        .lean()
        .then(categories => {
          categories.forEach(category => {
            records.filter(record => {
              if (String(record.categoryId) === String(category._id)) {
                record.icon = category.icon
                // 改變取出date呈現方式
                record.date = record.date.toDateString()
              }
            })
            if (String(categoryId) === String(category._id)) category.selected = true
          })
          const totalAmount = records.reduce((price, record) => {
            price += record.amount
            return price
          }, 0)
          Record.aggregate([
            {
              $project: {
                name: 1,
                date: 1,
                amount: 1,
                category: 1,
                merchant: 1,
                categoryId: 1,
                userId: 1,
                yearMonth: { $dateToString: { format: '%Y-%m', date: '$date' } }
              }
            },
            { $match: { categoryId, userId, yearMonth } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } }
          ])
            .then(categoryAmount => res.render('index', { records, totalAmount, categories, yearMonth, categoryAmount }))
        })
    })
    .catch(error => console.log(error))
})

module.exports = router
