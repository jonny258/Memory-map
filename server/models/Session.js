const { model, Schema } = require("mongoose");

const sessionSchema = new Schema({
    // cookie: {type: Object, required: true},
    isLoggedIn: {type: Boolean, required: true},
    currentUser: {type: Object, required: true}
});

const Session = model("session", sessionSchema);

module.exports = Session;
