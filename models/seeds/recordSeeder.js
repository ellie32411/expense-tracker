const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../record') 
const User = require('../user')
const db = require('../../config/mongoose')
const SEED_USER = {
  name: 'example',
  email: 'example@gmail.com',
  password: '12345678'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 10 },
        (_, i) => Record.create({
          name: `name-${i}`,
          amount: Math.floor(Math.random() * 5000),
          userId
        })
      ))
    })
    .then(() => {
      console.log('done')
      process.exit()
    })
})