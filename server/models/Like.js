const { model, Schema } = require("mongoose");

const likesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      marker: {
        type: Schema.Types.ObjectId,
        ref: 'Marker',
        required: true
      },
})

const Like = model('Like', likesSchema)

module.exports = Like;