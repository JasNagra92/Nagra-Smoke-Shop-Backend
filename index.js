const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/cart');
const testRoute = require('./routes/create-checkout-session')
const checkoutSessionRoute = require('./routes/checkout-session')
const webHookRoute = require('./routes/webHookRoute')
const excludedDates = require('./routes/getExcludedDates')
const loginRoute = require('./routes/loginUser') 
const signupRoute = require('./routes/signupUser')
const myAccountRoute = require('./routes/myAccount');

app.use('/webhook', webHookRoute);

app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.static(path.resolve(__dirname, './client/build')));

app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/create-checkout-session', testRoute);
app.use('/checkout-session', checkoutSessionRoute);
app.use('/getExcludedDates', excludedDates);
app.use('/login', loginRoute);
app.use('/signup', signupRoute)
app.use('/myAccount', myAccountRoute)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});


mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, '0.0.0.0', () => {
      console.log(`db connected and server now listening on`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
