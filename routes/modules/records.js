const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      Category.find()
        .lean()
        .then(categories => {
          record.date = record.date.toJSON().substring(0, 10)
          categories.forEach(category => {
            category.match = String(category._id) === String(record.categoryId)
          }) // 用在edit category 的option selected指定
          res.render('edit', { record, categories })
        })
    })
    .catch(error => console.log(error))
})

// 新增消費紀錄
router.post('/', (req, res) => {
  req.body.userId = req.user._id
  return Category.find()
    .lean()
    .then(categories => {
      categories.forEach(category => {
        if (category.name === req.body.category) req.body.categoryId = category._id
      })
      Record.create(req.body)
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
})

// 修改消費紀錄
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Category.find()
    .lean()
    .then(categories => {
      categories.forEach(category => {
        if (category.name === req.body.category) req.body.categoryId = category._id
      })
      Record.findOne({ _id, userId })
        .then(record => {
          record = Object.assign(record, req.body)
          return record.save()
        })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOneAndRemove({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
