const mongoose = require('mongoose');

const matchSchema = mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    fieldNumber: {
      type: Number,
    },
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    score1: {
      type: Number,
      default: 0,
    },
    score2: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'],
      default: 'scheduled',
    },
    round: {
      type: String,
      enum: ['pool', 'quarterfinal', 'semifinal', 'final', 'placement'],
    },
    spiritScores: {
      team1Score: { type: Number, default: 0 },
      team2Score: { type: Number, default: 0 },
      submitted: { type: Boolean, default: false },
    },
    matchNotes: {
      type: String,
    },
    photos: [
      {
        url: String,
        caption: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    scoringHistory: [
      {
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Team',
        },
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
        },
        time: Date,
        points: { type: Number, default: 1 },
      },
    ],
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Match', matchSchema);