const mongoose = require('mongoose');

const playerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    age: {
      type: Number,
      required: [true, 'Please add an age'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Please add gender'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    phone: {
      type: String,
    },
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'professional'],
      default: 'beginner',
    },
    yearsPlaying: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
    },
    jerseyNumber: {
      type: Number,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    teams: [
      {
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Team',
        },
        tournament: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tournament',
        },
        jerseyNumber: Number,
        role: {
          type: String,
          enum: ['captain', 'player', 'substitute'],
          default: 'player',
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tournamentHistory: [
      {
        tournament: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tournament',
        },
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Team',
        },
        matchesPlayed: { type: Number, default: 0 },
        goalsScored: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        spiritScore: { type: Number, default: 0 },
      },
    ],
    statistics: {
      totalTournaments: { type: Number, default: 0 },
      totalMatches: { type: Number, default: 0 },
      totalGoals: { type: Number, default: 0 },
      totalAssists: { type: Number, default: 0 },
      averageSpiritScore: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Player', playerSchema);

