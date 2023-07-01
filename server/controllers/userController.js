const { User } = require("../models");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const userLogin = async (req, res) => {
  try {
    const selectedUser = await User.findOne( {email: req.body.email})
    if(!selectedUser){
        res.json('This user doesn\'t exist')
    }else if(selectedUser.password !== req.body.password){
        res.json('The user exists but the password is incorrect')
    }else{
        res.json(selectedUser)
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const userSignUp = async (req, res) => {
  try {
    const doesUserExist = await User.findOne({email: req.body.email})
    if(doesUserExist){
      res.json('This email is already linked to an account')
    }else{
      const newUser = await User.create(req.body);
      res.json(newUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getAllUsers, userLogin, userSignUp };
