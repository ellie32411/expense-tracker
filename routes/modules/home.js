const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const dayjs = require('dayjs')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.log(error))
})


module.exports = router