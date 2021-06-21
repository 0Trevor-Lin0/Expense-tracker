const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

router.post('/', (req, res) => {
  const newData = req.body
  return Record.create(newData)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
