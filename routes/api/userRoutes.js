const router = require("express").Router();
const {
  getUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

//api/users
router.route("/").get(getUser).post(createUser);

//api/users/:userId
router.route("/:userId").get(getSingleUser).delete(deleteUser).put(updateUser);

router.route("/:userId/friends/:friendId").post(addFriend);

router.route("/:userId/friends/:friendId").delete(removeFriend);

module.exports = router;
