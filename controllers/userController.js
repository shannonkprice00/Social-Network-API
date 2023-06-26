const User = require('../models/User');
const { Types } = require("mongoose");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user
  async updateSingleUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'No user with that id!' });
      }  

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete a user
  async deleteSingleUser (req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if(!user) {
        return res.status(404).json({ message: 'no user that ID' });
      }
      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a friend
  async createFriend (req, res) {
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
          message: 'No user with that id!',
        });
      }
      res.status(200).json(friend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete a friend
  async deleteFriend (req, res) {
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
      res.status(200).json({ message: 'Friend successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

