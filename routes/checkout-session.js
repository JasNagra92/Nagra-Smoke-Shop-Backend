const express = require('express');
const router = express.Router();
const Orders = require('../models/orderModel')

router.get('/', async (req, res) => {
    const doc = await Orders.findOne({checkoutSessionId: req.query.id })
    res.json(doc)
})

module.exports = router