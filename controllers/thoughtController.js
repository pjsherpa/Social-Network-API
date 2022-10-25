const { User, Thought } = require("../models");

module.exports = {
  //Get Thoughts
  getThoughts(req, res) {
    Thought.find()
      // .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  //get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughId })
      // .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought on this id" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        console.log(thought);
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => {
        console.log(user);
        if (!user) {
          res.status(404).json({
            message: "Thought created but no user with this ID",
          });
          return;
        }
        res.json(user);
      })

      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  updateThought(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-___v")
    ).catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.userId })
      .then((thought) =>
        !thought
          ? res.status(400).json({ message: "no such thought exists" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: params.thoughtId } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: "thought deleted but no user found",
            })
          : res.json({ message: "Thought deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
