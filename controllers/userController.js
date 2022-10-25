const { User, Thought } = require("../models");

module.exports = {
  getUser(req, res) {
    //Get Users
    User.find()
      .select("-__v")
      .then((dbUserData) => {
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  //Get One User with id and get his thoughts and friends data
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  //Create New user
  createUser({ body }, res) {
    User.create(body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  //update user by id
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //delete user by id
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "no such user exists" })
          : Thought.findOneAndUpdate(
              { users: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "User deleted but no thoughts found",
            })
          : res.json({ message: "User deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  addToFriendList({ params }, res) {
    User.findOneAndUpdate(
      {
        _id: params.userId,
      },
      {
        $push: {
          friends: params.friendId,
        },
      },
      {
        new: true,
      }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "No user found with this id!",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  },

  //delete friend
  removefromFriendList({ params }, res) {
    User.findOneAndDelete({
      _id: params.thoghtId,
    })
      .then((deletedFriend) => {
        if (!deletedFriend) {
          return res.status(404).json({
            message: "No friend found with this id.",
          });
        }
        return User.findOneAndUpdate(
          {
            friends: params.friendId,
          },
          {
            $pull: {
              friends: params.friendId,
            },
          },
          {
            new: true,
          }
        );
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "No friend found with this id.",
          });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },
};
