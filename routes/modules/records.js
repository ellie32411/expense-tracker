const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.post('/', (req, res) => {
  const { name, amount, date, category } = req.body
  Category.findOne({ name: category })
          .lean()
          .then(category => {
            Record.create({
              name,
              date,
              categoryId: category._id,
              categoryName: category.name,
              categoryIcon: category.icon,
              amount,
              userId: req.user._id,
            })
          })
          .then(() => res.redirect('/'))
          .catch(error => console.log(error))
})

router.get('/new', (req, res) => {
  Category.find()
          .lean()
          .then(categorys => {
            return res.render('new', { categorys })
          })
          .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  Record.findById(_id)
        .lean()
        .then(record => {
          Category.find()
                  .lean()
                  .then(categorys => {
                    res.render('edit', {record, categorys})
                  })
        })
        .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const _id = req.params.id
  const { name, amount, category, date} = req.body
  Category.findOne({ name: category })
          .lean()
          .then(category => {
            Record.findById(_id)
                  .then(record => {
                    record = Object.assign(record, req.body)
                    record.categoryName = category.name
                    record.categoryIcon = category.icon
                    console.log(record)
                    return record.save()
                  })
                  .then(() => res.redirect('/'))
                  .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then((record) => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/category/:categoryName', (req, res) => {
  const userId = req.user._id
  const categoryName = req.params.categoryName
  Record.find({ categoryName, userId })
        .lean()
        .then(records => {
          let totalAmount = 0
          records.forEach(record => {
            totalAmount += record.amount
          })
          res.render('index', { records, totalAmount })
        })
        .catch(error => console.log(error))
})

module.exports = router