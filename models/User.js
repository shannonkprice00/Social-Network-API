const { Schema, model } = require("mongoose");
const Thought = require('./Thought');

// Schema to create User model
const userSchema = new Schema({
  username: { type: String, unique: true, required: true, trim: true },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^[\w\-._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  thoughts: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
  ],
  friends: [
    {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
  ],
},
{
    toJSON: {
        virtuals: true,
    },
    id: false,
});

// Pre-remove hook to remove any thoughts associated with user when user is deleted
userSchema.pre('remove', async function(next) {
  try {
    const thoughts = await Thought.find({ username: this.username });

    for (let i = 0; i < thoughts.length; i++) {
      await thoughts[i].remove();
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

// Virtual property 'friendCount' that gets the amount of friends per user
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
