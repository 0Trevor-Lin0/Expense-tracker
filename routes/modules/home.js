const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  Record.find()
    .lean()
    .sort('_id')
    .then(records => {
      records.forEach(record => {
        record.date = record.date.toLocaleDateString()
      })
      res.render('index', { records })
    })
    .catch(error => console.log(error))
})

module.exports = router
