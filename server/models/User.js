const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String },
});

const User = model("user", userSchema);

module.exports = User;
