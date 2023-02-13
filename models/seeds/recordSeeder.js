const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../record') 
const User = require('../user')
const Category = require('../category')
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
    .then((user) => {
      const userId = user._id
      return Category.find()
                     .lean()
                     .sort({ _id: 'asc'})
                     .then(categories => {return Record.create({
                             name: '晚餐',
                             date: '2022-06-10',
                             amount: 100,
                             categoryId: categories[3]._id,
                             categoryIcon: 'fa-solid fa-utensils',
                             categoryName: '餐飲食品',
                             userId
                           })
                         })
                     .catch(error => console.log(error))
                    })

    .then(() => {
      console.log('recordSeeder done.')
      process.exit()
    })
})