const { Session } = require('../models')
const getSessionData = async (req, res) => {
    try {
      const session = await Session.find({})
      res.json(session)
    } catch (err) {
      res.status(500).json(err);
    }
  };

module.exports = { getSessionData }