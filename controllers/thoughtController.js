const { Thought, User } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();

      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get a single thought by thought Id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
  
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID!' });
      }

      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
      console.error(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought created, but found no user with that ID!',
        });
      }

      res.status(200).json('Created the thought successfully!');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // update an existing thought by thought Id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

      res.status(200).json({ message: 'Thought updated successfully!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // delete an existing thought by thought Id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Thought deleted but no user with this ID!' });
      }

      res.status(200).json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Add a thought reaction to existing thought by thought Id
  async addThoughtReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

      res.status(200).json({ message: 'Reaction added successfully!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove thought reaction by thought Id & reaction Id
  async removeThoughtReaction(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
        reactions:
        {
          $elemMatch: { reactionId: req.params.reactionId }
        }
      });
      if (!thought) {
        return res.status(404).json({ message: 'Incorrect thought or reaction ID! Please use valid IDs!' });
      }
  
      const reaction = thought.reactions.find(
        reaction => reaction.reactionId.toString() === req.params.reactionId
      );
  
      thought.reactions.pull(reaction);
  
      await thought.save();
  
      return res.status(200).json({ message: 'Reaction deleted successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};