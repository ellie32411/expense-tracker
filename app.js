const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Record = require('./models/record')
const app = express()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.log(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  const { name, amount } = req.body
  return Record.create({ 
    name,
    amount
   })
   .then(() => res.redirect('/'))
   .catch(error => console.log(error))
})

app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch((error) => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, amount } = req.body
  return Record.findById(id)
    .then((record) => {
      record.name = name
      record.amount = amount
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then((record) => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})