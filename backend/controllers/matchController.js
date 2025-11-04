const Match = require('../models/matchModel');
const Tournament = require('../models/tournamentModel');
const Team = require('../models/teamModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new match
// @route   POST /api/matches
// @access  Private/Admin
const createMatch = asyncHandler(async (req, res) => {
  const { 
    tournament, field, fieldNumber, team1, team2, 
    startTime, endTime, round, matchNotes 
  } = req.body;

  // Validate tournament exists
  const tournamentExists = await Tournament.findById(tournament);
  if (!tournamentExists) {
    res.status(404);
    throw new Error('Tournament not found');
  }

  // Validate teams exist
  const team1Exists = await Team.findById(team1);
  const team2Exists = await Team.findById(team2);
  if (!team1Exists || !team2Exists) {
    res.status(404);
    throw new Error('One or both teams not found');
  }

  // Create match
  const match = await Match.create({
    tournament,
    field,
    fieldNumber,
    team1,
    team2,
    startTime,
    endTime,
    round,
    matchNotes,
    updatedBy: req.user._id
  });

  // Add match to tournament
  tournamentExists.matches.push(match._id);
  await tournamentExists.save();

  res.status(201).json(match);
});

// @desc    Get all matches
// @route   GET /api/matches
// @access  Public
const getMatches = asyncHandler(async (req, res) => {
  const { tournament, team, status, date } = req.query;
  
  // Build query
  const query = {};
  
  if (tournament) {
    query.tournament = tournament;
  }
  
  if (team) {
    query.$or = [{ team1: team }, { team2: team }];
  }
  
  if (status) {
    query.status = status;
  }
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    query.startTime = { $gte: startOfDay, $lte: endOfDay };
  }
  
  const matches = await Match.find(query)
    .populate('team1', 'name')
    .populate('team2', 'name')
    .populate('tournament', 'name')
    .sort({ startTime: 1 });
  
  res.json(matches);
});

// @desc    Get match by ID
// @route   GET /api/matches/:id
// @access  Public
const getMatchById = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id)
    .populate('team1', 'name jerseyColors')
    .populate('team2', 'name jerseyColors')
    .populate('tournament', 'name')
    .populate('scoringHistory.player', 'name');
  
  if (!match) {
    res.status(404);
    throw new Error('Match not found');
  }
  
  res.json(match);
});

// @desc    Update match
// @route   PUT /api/matches/:id
// @access  Private/Admin
const updateMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);
  
  if (!match) {
    res.status(404);
    throw new Error('Match not found');
  }
  
  // Update match fields
  Object.keys(req.body).forEach(key => {
    match[key] = req.body[key];
  });
  
  match.updatedBy = req.user._id;
  
  const updatedMatch = await match.save();
  
  res.json(updatedMatch);
});

// @desc    Update match score
// @route   PUT /api/matches/:id/score
// @access  Private
const updateScore = asyncHandler(async (req, res) => {
  const { score1, score2, status } = req.body;
  
  const match = await Match.findById(req.params.id);
  
  if (!match) {
    res.status(404);
    throw new Error('Match not found');
  }
  
  match.score1 = score1 !== undefined ? score1 : match.score1;
  match.score2 = score2 !== undefined ? score2 : match.score2;
  
  if (status) {
    match.status = status;
  }
  
  match.updatedBy = req.user._id;
  
  const updatedMatch = await match.save();
  
  // If match is completed, update team statistics
  if (status === 'completed') {
    await updateTeamStats(match);
  }
  
  res.json(updatedMatch);
});

// @desc    Add scoring event
// @route   POST /api/matches/:id/score-event
// @access  Private
const addScoringEvent = asyncHandler(async (req, res) => {
  const { team, player, time, points } = req.body;
  
  const match = await Match.findById(req.params.id);
  
  if (!match) {
    res.status(404);
    throw new Error('Match not found');
  }
  
  // Add scoring event
  match.scoringHistory.push({
    team,
    player,
    time: time || new Date(),
    points: points || 1
  });
  
  // Update score
  if (match.team1._id.toString() === team) {
    match.score1 += points || 1;
  } else if (match.team2._id.toString() === team) {
    match.score2 += points || 1;
  }
  
  match.updatedBy = req.user._id;
  
  const updatedMatch = await match.save();
  
  res.json(updatedMatch);
});

// @desc    Add match photo
// @route   POST /api/matches/:id/photos
// @access  Private
const addMatchPhoto = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);
  
  if (!match) {
    res.status(404);
    throw new Error('Match not found');
  }
  
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  
  // Create photo URL based on file path
  const photoUrl = `/uploads/${req.file.filename}`;
  const caption = req.body.caption || '';
  
  match.photos.push({
    url: photoUrl,
    caption,
    uploadedBy: req.user._id,
    uploadedAt: new Date()
  });
  
  const updatedMatch = await match.save();
  
  // Return the photo object
  const addedPhoto = match.photos[match.photos.length - 1];
  
  res.status(201).json({
    message: 'Photo uploaded successfully',
    photo: addedPhoto
  });
});

// @desc    Delete match photo
// @route   DELETE /api/matches/:id/photos/:photoId
// @access  Private
const deleteMatchPhoto = asyncHandler(async (req, res) => {
  const { id, photoId } = req.params;
  const fs = require('fs');
  const path = require('path');
  
  const match = await Match.findById(id);
  
  if (!match) {
    res.status(404);
    throw new Error('Match not found');
  }
  
  // Find the photo
  const photo = match.photos.id(photoId);
  if (!photo) {
    res.status(404);
    throw new Error('Photo not found');
  }
  
  // Delete file from disk if it exists
  if (photo.url && photo.url.includes('/uploads/')) {
    const filename = photo.url.split('/uploads/')[1];
    const filepath = path.join(__dirname, '../uploads', filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
  
  // Remove photo from database
  photo.remove();
  await match.save();
  
  res.json({ message: 'Photo deleted successfully' });
});

// @desc    Generate schedule for tournament
// @route   POST /api/tournaments/:id/schedule
// @access  Private/Admin
const generateSchedule = asyncHandler(async (req, res) => {
  const { scheduleType, startDate, endDate, matchDuration, dailyStartTime, dailyEndTime } = req.body;
  
  const tournament = await Tournament.findById(req.params.id)
    .populate('teams');
  
  if (!tournament) {
    res.status(404);
    throw new Error('Tournament not found');
  }
  
  // Check if teams are available
  if (!tournament.teams || tournament.teams.length < 2) {
    res.status(400);
    throw new Error('Not enough teams to generate schedule');
  }
  
  let matches = [];
  
  if (scheduleType === 'round-robin') {
    matches = generateRoundRobinSchedule(
      tournament, 
      startDate, 
      endDate, 
      matchDuration, 
      dailyStartTime, 
      dailyEndTime
    );
  } else if (scheduleType === 'bracket') {
    matches = generateBracketSchedule(
      tournament, 
      startDate, 
      endDate, 
      matchDuration, 
      dailyStartTime, 
      dailyEndTime
    );
  } else {
    res.status(400);
    throw new Error('Invalid schedule type');
  }
  
  // Save all matches
  const savedMatches = await Match.insertMany(matches);
  
  // Add matches to tournament
  tournament.matches = tournament.matches.concat(savedMatches.map(match => match._id));
  await tournament.save();
  
  res.status(201).json(savedMatches);
});

// Helper function to update team statistics after match completion
const updateTeamStats = async (match) => {
  const team1 = await Team.findById(match.team1);
  const team2 = await Team.findById(match.team2);
  
  if (!team1 || !team2) return;
  
  // Update team1 stats
  team1.statistics.matchesPlayed += 1;
  team1.statistics.goalsScored += match.score1;
  team1.statistics.goalsConceded += match.score2;
  
  if (match.score1 > match.score2) {
    team1.statistics.wins += 1;
  } else if (match.score1 < match.score2) {
    team1.statistics.losses += 1;
  } else {
    team1.statistics.draws += 1;
  }
  
  // Update team2 stats
  team2.statistics.matchesPlayed += 1;
  team2.statistics.goalsScored += match.score2;
  team2.statistics.goalsConceded += match.score1;
  
  if (match.score2 > match.score1) {
    team2.statistics.wins += 1;
  } else if (match.score2 < match.score1) {
    team2.statistics.losses += 1;
  } else {
    team2.statistics.draws += 1;
  }
  
  // Update spirit scores if available
  if (match.spiritScores && match.spiritScores.submitted) {
    team1.statistics.spiritScore += match.spiritScores.team1Score;
    team2.statistics.spiritScore += match.spiritScores.team2Score;
  }
  
  await team1.save();
  await team2.save();
};

// Helper function to generate round-robin schedule
const generateRoundRobinSchedule = (tournament, startDate, endDate, matchDuration, dailyStartTime, dailyEndTime) => {
  const teams = tournament.teams;
  const matches = [];
  const fields = tournament.fields;
  
  if (!fields || fields.length === 0) {
    throw new Error('No fields available for scheduling');
  }
  
  // Parse times
  const [startHour, startMinute] = dailyStartTime.split(':').map(Number);
  const [endHour, endMinute] = dailyEndTime.split(':').map(Number);
  const durationMinutes = matchDuration || 60; // Default to 60 minutes
  
  // Calculate slots per day
  const startTimeMinutes = startHour * 60 + startMinute;
  const endTimeMinutes = endHour * 60 + endMinute;
  const minutesPerDay = endTimeMinutes - startTimeMinutes;
  const slotsPerDay = Math.floor(minutesPerDay / durationMinutes);
  
  if (slotsPerDay <= 0) {
    throw new Error('Invalid time range or match duration');
  }
  
  // Generate all possible team pairings
  const pairings = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      pairings.push({
        team1: teams[i]._id,
        team2: teams[j]._id
      });
    }
  }
  
  // Calculate schedule dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  // Assign matches to time slots
  let pairingIndex = 0;
  
  for (let day of days) {
    for (let slot = 0; slot < slotsPerDay; slot++) {
      for (let field of fields) {
        if (pairingIndex >= pairings.length) {
          return matches; // All pairings scheduled
        }
        
        const pairing = pairings[pairingIndex++];
        
        // Calculate start and end times
        const slotStartMinutes = startTimeMinutes + (slot * durationMinutes);
        const startTime = new Date(day);
        startTime.setHours(Math.floor(slotStartMinutes / 60));
        startTime.setMinutes(slotStartMinutes % 60);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);
        
        matches.push({
          tournament: tournament._id,
          field: field.name,
          fieldNumber: field.fieldNumber,
          team1: pairing.team1,
          team2: pairing.team2,
          startTime,
          endTime,
          round: 'pool',
          status: 'scheduled',
          updatedBy: tournament.organizer
        });
      }
    }
  }
  
  return matches;
};

// Helper function to generate bracket schedule
const generateBracketSchedule = (tournament, startDate, endDate, matchDuration, dailyStartTime, dailyEndTime) => {
  // Implementation for bracket scheduling would go here
  // This is more complex and would depend on the number of teams
  // For now, return an empty array
  return [];
};

module.exports = {
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  updateScore,
  addScoringEvent,
  addMatchPhoto,
  deleteMatchPhoto,
  generateSchedule
};