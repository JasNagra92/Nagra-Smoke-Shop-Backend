const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

const Order = require("../models/orderModel");

router.get("/", requireAuth, async (req, res) => {
  const { email } = req.user;
  const orders = await Order.find({ email }).select(
    "items email orderNumber pickupDate OrderDate amount_total"
  );
  res.status(200).json({ orders });
});

module.exports = router;
