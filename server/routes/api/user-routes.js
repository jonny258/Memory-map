const router = require("express").Router();

const {
  getAllUsers,
  userLogin,
  userSignUp,
  getMarkersFromUser,
  createMarkersInUser,
  updateAMarker,
  deleteAMarker,
} = require("../../controllers/userController");

router.route("/").get(getAllUsers);

router.route("/login").post(userLogin);
router.route("/signup").post(userSignUp);

router
  .route("/marker/:userid")
  .get(getMarkersFromUser)
  .post(createMarkersInUser)
  .put(updateAMarker)
  .delete(deleteAMarker)

module.exports = router;
