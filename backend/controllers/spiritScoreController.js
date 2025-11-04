const asyncHandler = require('express-async-handler');
const SpiritScore = require('../models/spiritScoreModel');
const Team = require('../models/teamModel');
const Match = require('../models/matchModel');
const Player = require('../models/playerModel');

// @desc    Submit a spirit score
// @route   POST /api/spirit-scores
// @access  Private (Team managers, Tournament directors)
const submitSpiritScore = asyncHandler(async (req, res) => {
  const { matchId, submittedByTeamId, submittedForTeamId, rulesKnowledge, foulsAndBody, fairMindedness, positiveAttitude, communication, comments } = req.body;

  // Validate match exists
  const match = await Match.findById(matchId);
  if (!match) {
    res.status(404);
    throw new Error('Match not found');
  }

  // Determine submitting team - either from request body or find user's team in this match
  let submittingTeamId = submittedByTeamId;

  if (!submittingTeamId) {
    // First find the player associated with this user
    const player = await Player.findOne({ user: req.user._id });

    if (!player) {
      res.status(400);
      throw new Error('You must be registered as a player to submit a spirit score');
    }

    // Find which team the player belongs to in this match
    const userTeams = await Team.find({
      $or: [
        { captain: player._id },
        { coCaptain: player._id },
        { 'players.player': player._id }
      ],
      tournament: match.tournament
    });

    // Find the team that's in this match
    const matchTeam = userTeams.find(team =>
      team._id.equals(match.team1) || team._id.equals(match.team2)
    );

    if (matchTeam) {
      submittingTeamId = matchTeam._id;
    } else {
      res.status(400);
      throw new Error('You must be part of a team in this match to submit a spirit score');
    }
  }

  // Validate submittedFor team exists
  const teamFor = await Team.findById(submittedForTeamId);
  if (!teamFor) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if score already submitted
  const existingScore = await SpiritScore.findOne({
    match: matchId,
    submittedBy: submittingTeamId,
    submittedFor: submittedForTeamId
  });

  if (existingScore) {
    res.status(400);
    throw new Error('Spirit score already submitted for this match');
  }

  // Create spirit score
  const spiritScore = await SpiritScore.create({
    match: matchId,
    submittedBy: submittingTeamId,
    submittedFor: submittedForTeamId,
    rulesKnowledge,
    foulsAndBody,
    fairMindedness,
    positiveAttitude,
    communication,
    comments
  });

  if (spiritScore) {
    res.status(201).json(spiritScore);
  } else {
    res.status(400);
    throw new Error('Invalid spirit score data');
  }
});

// @desc    Get spirit scores for a team
// @route   GET /api/spirit-scores/team/:teamId
// @access  Public
const getTeamSpiritScores = asyncHandler(async (req, res) => {
  const scores = await SpiritScore.find({ submittedFor: req.params.teamId })
    .populate('match', 'date')
    .populate('submittedBy', 'name');

  // Calculate average score
  let totalScore = 0;
  scores.forEach(score => {
    totalScore += score.totalScore;
  });
  
  const averageScore = scores.length > 0 ? (totalScore / scores.length).toFixed(1) : 0;

  res.status(200).json({
    scores,
    averageScore,
    count: scores.length
  });
});

// @desc    Get spirit scores for a match
// @route   GET /api/spirit-scores/match/:matchId
// @access  Private (Team managers, Tournament directors, Tech team)
const getMatchSpiritScores = asyncHandler(async (req, res) => {
  const scores = await SpiritScore.find({ match: req.params.matchId })
    .populate('submittedBy', 'name')
    .populate('submittedFor', 'name');

  res.status(200).json(scores);
});

module.exports = {
  submitSpiritScore,
  getTeamSpiritScores,
  getMatchSpiritScores
};