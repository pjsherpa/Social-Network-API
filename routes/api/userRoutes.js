const router = require("express").Router();
const {
  getUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/userController");

//api/users
router.route("/").get(getUser).post(createUser);

//api/users/:userId
router.route("/:userId").get(getSingleUser).delete(deleteUser).put(updateUser);

router.route("/:userId/friends/:friendId").post(addToFriendList);

router.route("/:userId/friends/:friendId").delete(removefromFriendList);

module.exports = router;
