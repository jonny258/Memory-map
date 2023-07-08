const { Session } = require('../models')
const getSessionData = async (req, res) => {
    try {
      const session = await Session.find({})
      res.json(session)
    } catch (err) {
      res.status(500).json(err);
    }
  };

  const deleteSession = async (req, res) => {
    try {
      await Session.deleteMany({});
      res.json({ message: 'All sessions have been deleted.' });
    } catch (err) {
      res.status(500).json(err);
    }
  };

module.exports = { getSessionData, deleteSession }