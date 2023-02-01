const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Record = require('./models/record')
const routes = require('./routes')

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
app.use(methodOverride('_method'))

app.use(routes)

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})