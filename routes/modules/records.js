const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => {
      Category.find()
        .lean()
        .then(categories => {
          record.date = record.date.toJSON().split('T')[0]
          categories.forEach(category => {
            category.match = category.name === record.category
          }) // 用在edit category 的option selected指定
          res.render('edit', { record, categories })
        })
    })
    .catch(error => console.log(error))
})

router.post('/', (req, res) => {
  const newData = req.body
  return Record.create(newData)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
