const { model, Schema } = require("mongoose");

const markerSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
});

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String },
  pfp: {type: String, default: 'https://upcdn.io/FW25bUs/image/uploads/2023/07/21/5856-5UKp.jpg.crop?w=600&h=600&fit=max&q=70'},
  markers: [markerSchema],
});

const User = model("user", userSchema);

module.exports = User;
