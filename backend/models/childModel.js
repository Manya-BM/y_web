const mongoose = require('mongoose');

const childSchema = mongoose.Schema(
  {
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
      required: [true, 'Please add gender'],
      enum: ['male', 'female', 'other'],
    },
    community: {
      type: String,
      required: [true, 'Please add community'],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        present: {
          type: Boolean,
          default: false,
        },
        notes: String,
      },
    ],
    lsasScores: [
      {
        date: {
          type: Date,
          required: true,
        },
        category: {
          type: String,
          required: true,
          enum: ['teamwork', 'communication', 'leadership', 'resilience', 'problemSolving'],
        },
        score: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        notes: String,
      },
    ],
    homeVisits: [
      {
        date: {
          type: Date,
          required: true,
        },
        coach: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        notes: String,
      },
    ],
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Child', childSchema);