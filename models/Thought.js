const { Schema, Types, model } = require("mongoose");
const moment = require('moment');

// Schema to create reaction to be embedded in Thought model
const reactionSchema = new Schema({
    reactionId: { 
        type: Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: { type: String, required: true, maxLength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, 
        default: Date.now,
        get: function(value) {
           return moment(value).format('MM-DD-YYYY HH:mm:ss')
        } },
},
{
    toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false, 
});

// Schema to create Thought model
const thoughtSchema = new Schema({
    thoughtText: { type: String, required: true, maxLength: 128 },
    username: { type: String, required: true },
    createdAt: { type: Date, 
                 default: Date.now,
                 get: function(value) {
                    return moment(value).format('MM-DD-YYYY HH:mm:ss')
                 } },
    reactions: [reactionSchema],
},
{
    toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false, 
});

// Virtual property 'reactionCount' that gets the amount of friends per user
thoughtSchema.virtual('reactionsCount').get(function () {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;