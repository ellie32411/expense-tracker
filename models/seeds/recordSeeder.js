const Record = require('../record') // 載入 todo model
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Record.create({ 
      name: `name-${i}`,
      amount: 1000 
    })
  }
  console.log('done')
})