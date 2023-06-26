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

// Virtual property 'friendCount' that gets the amount of friends per user
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
