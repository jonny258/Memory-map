const { model, Schema } = require("mongoose");

const markerSchema = new Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  media: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "Like"
  }],
});

const Marker = model('Marker', markerSchema)

module.exports = Marker;