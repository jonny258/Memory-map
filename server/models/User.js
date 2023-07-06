const { model, Schema } = require("mongoose");

const markerSchema = new Schema({
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: String, required: true},
    name: {type: String, required: true},
})

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String },
  markers: [markerSchema]
});

const User = model("user", userSchema);

module.exports = User;
