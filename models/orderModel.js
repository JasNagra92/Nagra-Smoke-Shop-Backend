const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// the layout every order document will have in the database
const OrderSchema = new Schema({
  name: { type: String, required: true },
  email: {type: String, required: true},
  checkoutSessionId: {type: String, required: true},
  items: { type: Array, required: true },
  amount_total: {type: Number, required: true},
  orderNumber: {type: Number, required: true},
  paid: { type: Boolean, required: true },
  pickupDate: { type: String, required: true },
  OrderDate: {type: String, required: true}
});

module.exports = mongoose.model('order', OrderSchema);
