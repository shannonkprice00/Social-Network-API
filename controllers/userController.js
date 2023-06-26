const { User, Thought } = require('../models');
const { Types } = require("mongoose");

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get a single user by Id
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID!' });
      }

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.status(200).json({ message: 'User created successfully!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user by Id
  async updateSingleUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID!' });
      }  

      res.status(200).json({ message: 'User updated successfully!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete a user by Id
  async deleteSingleUser (req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if(!user) {
        return res.status(404).json({ message: 'no user found with that ID!' });
      }

      await Thought.deleteMany({ username: user.username });

      res.status(200).json({ message: 'User successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // add a friend
  async addFriend (req, res) {
    try {
      if (!Types.ObjectId.isValid(req.params.friendId)) {
        return res.status(404).json({
          message: 'The requested friend is not a valid ID; please check friendId parameter',
        });
      }
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!friend) {
        return res.status(404).json({
          message: 'No user with that ID!',
        });
      }
      res.status(200).json({ message: 'Friend successfully added!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // remove a friend
  async removeFriend (req, res) {
    try {
      if (!Types.ObjectId.isValid(req.params.friendId)) {
        return res.status(404).json({
          message: 'The requested friend is not a valid ID; please check friendId parameter!',
        });
      }
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!friend) {
        return res.status(404).json({ message: "User ID is invald; please check userId parameter!" })
      }
      res.status(200).json({ message: 'Friend successfully removed!' });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

