const router = require("express").Router();

const {
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
} = require("../../controllers/userController");

router.route("/").get(getAllUsers).delete(deleteAllUsers);

router.route("/login").post(userLogin);
router.route("/signup").post(userSignUp);

router.route('/:userid').get(getOneUsers).put(updateUser)

router
  .route("/marker/:userid")
  .get(getMarkersFromUser)
  .post(createMarkersInUser)
  .put(updateAMarker)
  .delete(deleteAMarker)

module.exports = router;
