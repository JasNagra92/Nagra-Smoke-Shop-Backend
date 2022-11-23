const express = require('express');
const router = express.Router();
const MenuItems = require('../models/menuItemModel');

router.get('/', async (req, res) => {
  const cart = req.query.cart;
  let data = [];
  try {
    for (const obj of cart) {
      const doc = await MenuItems.findOne({ _id: obj._id})
      let cartItem = doc.toObject()
      cartItem.quantity = obj.quantity
      data.push(cartItem);
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(200).json({ error: error });
  }
});

module.exports = router;
