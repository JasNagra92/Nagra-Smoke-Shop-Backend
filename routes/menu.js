const express = require("express");
const router = express.Router();
const MenuItems = require("../models/menuItemModel");

router.get("/", async (req, res) => {
  const items = await MenuItems.find({}, {price_id: 0}).sort({
    name: "ascending",
  });

  res.status(200).json({ items });
});

module.exports = router;
