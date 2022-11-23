// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const express = require("express");
const router = express.Router();
const MenuItems = require("../models/menuItemModel");

const YOUR_DOMAIN = process.env.REACT_APP_baseURL || "http://localhost:4000/";

router.post("/", async (req, res) => {
  const { payload } = req.body;
  console.log(payload);
  let query = [];
  let stockError = false;
  // create a query containing price_id's of each item that was sent from the client
  for (const item of payload.items) {
    query.push(item.price_id);
  }
  // check menu items stock values in database against the quantity sent from client
  // and if any of the quantities is greater than the available stock set stockError
  // variable to true
  let inventoryItems = await MenuItems.find({ price_id: { $in: query } });
  for (const item of payload.items) {
    const inventoryItem = inventoryItems.find(
      (item) => item.price_id === item.price_id
    );
    if (item.quantity > inventoryItem.stock) {
      stockError = true;
    }
  }

  // send error as json object if previous check had found a stock error
  // otherwise create checkout session and send back the URL for redirect
  if (stockError) {
    res.json({ error: "not enough stock" });
  } else {
    let line_items = [];
    for (const item of payload.items) {
      line_items.push({
        price: item.price_id,
        quantity: item.quantity,
      });
    }
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      customer_creation: "always",
      customer_email: payload.email,
      metadata: {
        pickupDate: payload.pickupDate,
      },
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${YOUR_DOMAIN}success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}cancelled=true`,
      automatic_tax: { enabled: false },
    });
    return res.json({ url: session.url });
  }
});

module.exports = router;
