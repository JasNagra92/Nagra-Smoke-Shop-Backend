const express = require('express');
const router = express.Router();
const Orders = require('../models/orderModel')

router.get('/', async (req,res) => {
    const data = await Orders.find({}, {pickupDate: 1})
    const dates = []
    for (const item of data){
       dates.push(item.pickupDate) 
    }
    const formattedDates = dates.map(date => {
        return date.slice(0,10).replace(/-/g, ',')
    })

    res.send(formattedDates)
})

module.exports = router