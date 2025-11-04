const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a tournament name'],
    },
    title: {
      type: String,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    rules: {
      type: String,
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    maxTeams: {
      type: Number,
    },
    registrationDeadline: {
      type: Date,
    },
    banner: {
      type: String, // URL to banner image
    },
    sponsors: [
      {
        name: String,
        logo: String, // URL to sponsor logo
        website: String,
      },
    ],
    fields: [
      {
        name: {
          type: String,
          required: true,
        },
        fieldNumber: {
          type: Number,
        },
        location: String,
        capacity: Number,
        schedule: [
          {
            date: Date,
            startTime: String,
            endTime: String,
            matchId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Match',
            },
          },
        ],
      },
    ],
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
      },
    ],
    visitors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor',
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    spiritScoreEnabled: {
      type: Boolean,
      default: true,
    },
    announcements: [
      {
        title: String,
        content: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    statistics: {
      totalMatches: { type: Number, default: 0 },
      totalGoals: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      topScorer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tournament', tournamentSchema);