const mongoose = require('mongoose')
const Schema = mongoose.Schema
// model in case any new menu items need to be created or fetched
const menuSchema = new Schema({
    name: {type: String, required: true},
    price: {type: String, required: true},
    price_id: {type: String, required: true},
    stock: {type: Number, required: true}
})

module.exports = mongoose.model('menuItem', menuSchema, 'menuItems')