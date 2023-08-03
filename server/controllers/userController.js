const { User, Session } = require("../models");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    const users = await User.deleteMany({});
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneUsers = async (req, res) => {
  try {
    const userId = req.params.userid
    console.log(userId)
    const selectedUser = await User.findById(userId);
    console.log(selectedUser)
    res.json(selectedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

const userLogin = async (req, res) => {
  try {
    const selectedUser = await User.findOne({ email: req.body.email });
    if (!selectedUser) {
      res.json("This user doesn't exist");
    } else if (selectedUser.password !== req.body.password) {
      res.json("The user exists but the password is incorrect");
    } else {
      await Session.deleteMany({});

      await Session.create({
        cookie: req.session.cookie,
        isLoggedIn: true,
        currentUser: selectedUser,
      });
      res.json(selectedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const userSignUp = async (req, res) => {
  let debugInfo = {}; // Object to store debug information
  try {
    debugInfo.requestBody = req.body;
    const doesUserExist = await User.findOne({ email: req.body.email });
    debugInfo.doesUserExist = doesUserExist;
    if (doesUserExist) {
      res.json({ message: "This email is already linked to an account", debugInfo });
    } else {
      const newUser = await User.create(req.body);
      debugInfo.newUser = newUser;
      // rest of the code...
      res.json({ newUser, debugInfo });
    }
  } catch (err) {
    debugInfo.error = err;
    res.status(500).json({ error: err, debugInfo });
  }
};


const getMarkersFromUser = async (req, res) => {
  try {
    const userId = req.params.userid;
    const selectedUser = await User.findById(userId);
    res.json(selectedUser.markers);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createMarkersInUser = async (req, res) => {
  try {
    const userId = req.params.userid;
    const user = await User.findById(userId);

    console.log(req.body.image)

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const selectedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          markers: {
            reactionBody: req.body.reactionBody,
            lat: req.body.lat,
            lng: req.body.lng,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            name: user.name,
            image: req.body.image,
          },
        },
      },
      { new: true }
    );

    res.json(selectedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const updateAMarker = async (req, res) => {
  try {
    const userId = req.params.userid;
    const markerIndex = req.body.markerIndex; // Assuming you have the index of the marker in req.body
    const updatedMarkerData = req.body.updatedMarkerData; // Assuming you have the updated marker data in req.body

    const updatedMarker = await User.findByIdAndUpdate(
      userId,
      { $set: { [`markers.${markerIndex}`]: updatedMarkerData } },
      { new: true }
    );

    res.json(updatedMarker);
  } catch (err) {
    res.status(500).json(err);
  }
};



const deleteAMarker = async (req, res) => {
  try {
    const userId = req.params.userid;
    const deleteIndex = req.body.deleteIndex;

    await User.findByIdAndUpdate(userId, {
      $unset: { [`markers.${deleteIndex}`]: 1 }
    });

    const deletedMarker = await User.findByIdAndUpdate(userId, {
      $pull: { markers: null }
    });

    res.json(deletedMarker);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userid;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    console.log(req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};



module.exports = {
  getAllUsers,
  userLogin,
  userSignUp,
  getMarkersFromUser,
  createMarkersInUser,
  updateAMarker,
  deleteAMarker,
  updateUser,
  getOneUsers,
  deleteAllUsers,
};
