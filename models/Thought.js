const { Schema, model } = require("mongoose");

// Schema to create Thought model
const thoughtSchema = new Schema({
    thoughtText: { type: String, required: true, maxLength: 128 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reactions: [reactionSchema],
},
{
    toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false, 
});

const reactionSchema = new Schema({
    reactionId: { 
        type: Schema.Types.ObjectId,
        // if the above line doesn't work, try type: mongoose.Schema.Types.ObjectId
        default: () => new Types.ObjectId(),
    },
    reactionBody: { type: String, required: true, maxLength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
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

thoughtSchema.virtual('createdAtFormatted').get(function() {
    return formatDate(this.createdAt);
});

reactionSchema.virtual('createdAtFormatted').get(function() {
    return formatDate(this.createdAt);
});

function formatDate(date) {
    return `${date.toLocalDateString()} ${date.toLocalTimeString()}`;
}

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;