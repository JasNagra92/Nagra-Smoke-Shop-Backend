const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
});

// create static signup function with password hashing

userSchema.statics.signup = async function (email, password, passwordConfirm, name, phoneNumber) {
  //validation
  if (!email || !password) {
    throw Error("all fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("password not strong enough");
  }
  if (!validator.equals(password, passwordConfirm)) {
    throw Error("passwords must match")
  }
  if (!validator.isMobilePhone(phoneNumber)) {
    throw Error ("must be a valid phone number")
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, name, phoneNumber });

  return user;
};

// static login method

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("all fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("incorrect password");
  }
  
  return user;
};

module.exports = mongoose.model("user", userSchema);
