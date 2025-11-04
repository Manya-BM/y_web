const mongoose = require('mongoose');

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a team name'],
      unique: false, // Teams can have same name in different tournaments
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    coCaptain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    players: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
          required: true,
        },
        jerseyNumber: {
          type: Number,
        },
        jerseyVerified: {
          type: Boolean,
          default: false,
        },
        role: {
          type: String,
          enum: ['captain', 'coCaptain', 'player', 'substitute'],
          default: 'player',
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rosterLocked: {
      type: Boolean,
      default: false,
    },
    jerseyColors: {
      primary: String,
      secondary: String,
    },
    statistics: {
      matchesPlayed: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      goalsScored: { type: Number, default: 0 },
      goalsConceded: { type: Number, default: 0 },
      spiritScore: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Team', teamSchema);

