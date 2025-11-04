const mongoose = require('mongoose');

const spiritScoreSchema = mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    submittedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    rulesKnowledge: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
      default: 2,
    },
    foulsAndBody: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
      default: 2,
    },
    fairMindedness: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
      default: 2,
    },
    positiveAttitude: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
      default: 2,
    },
    communication: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
      default: 2,
    },
    comments: {
      type: String,
      maxlength: 500,
    },
    totalScore: {
      type: Number,
      min: 0,
      max: 20,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total score before saving
spiritScoreSchema.pre('save', function(next) {
  this.totalScore = 
    this.rulesKnowledge + 
    this.foulsAndBody + 
    this.fairMindedness + 
    this.positiveAttitude + 
    this.communication;
  next();
});

module.exports = mongoose.model('SpiritScore', spiritScoreSchema);