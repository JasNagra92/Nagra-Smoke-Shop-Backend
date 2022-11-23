const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.JWT_SECRET, { expiresIn: "3d" });
};

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)

  try {
    const user = await User.login(email, password);
    
    const foundUser = {
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email
    }
    const token = createToken(user._id);

    res.status(200).json({ foundUser, token });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
});

module.exports = router;
