const Team = require('../models/teamModel');
const Tournament = require('../models/tournamentModel');
const Player = require('../models/playerModel');
const asyncHandler = require('express-async-handler');

// @desc    Register a team for a tournament
// @route   POST /api/teams
// @access  Private
const registerTeam = async (req, res) => {
  try {
    const {
      name,
      tournamentId,
      captainId,
      coCaptainId,
      players,
      jerseyColors,
    } = req.body;

    // Check if tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if tournament is full
    const existingTeams = await Team.countDocuments({ tournament: tournamentId, status: 'approved' });
    if (tournament.maxTeams && existingTeams >= tournament.maxTeams) {
      return res.status(400).json({ message: 'Tournament is full' });
    }

    // Check if team name already exists in this tournament
    const existingTeam = await Team.findOne({ name, tournament: tournamentId });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already taken in this tournament' });
    }

    // Create team
    const team = await Team.create({
      name,
      tournament: tournamentId,
      captain: captainId,
      coCaptain: coCaptainId,
      players: players || [],
      registeredBy: req.user._id,
      status: 'pending',
      jerseyColors: jerseyColors || {},
    });

    // Add team to tournament
    tournament.teams.push(team._id);
    await tournament.save();

    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
const getTeams = async (req, res) => {
  try {
    const { tournamentId } = req.query;
    let query = {};
    if (tournamentId) {
      query.tournament = tournamentId;
    }

    const teams = await Team.find(query)
      .populate('tournament', 'name startDate endDate')
      .populate('captain', 'name email jerseyNumber')
      .populate('coCaptain', 'name email')
      .populate('players.player', 'name email jerseyNumber')
      .populate('registeredBy', 'name email');

    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Public
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('tournament', 'name startDate endDate location')
      .populate('captain', 'name email phone jerseyNumber')
      .populate('coCaptain', 'name email phone jerseyNumber')
      .populate('players.player', 'name email age gender jerseyNumber position')
      .populate('registeredBy', 'name email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve/Reject team
// @route   PUT /api/teams/:id/approve
// @access  Private/Admin
const approveTeam = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.status = status;
    await team.save();

    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add player to team roster
// @route   POST /api/teams/:id/roster
// @access  Private
const addPlayerToRoster = async (req, res) => {
  try {
    const { playerId, jerseyNumber, role } = req.body;

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.rosterLocked) {
      return res.status(400).json({ message: 'Roster is locked' });
    }

    // Check if player already in roster
    const playerExists = team.players.find(p => p.player.toString() === playerId);
    if (playerExists) {
      return res.status(400).json({ message: 'Player already in roster' });
    }

    // Check if jersey number is taken
    if (jerseyNumber) {
      const jerseyTaken = team.players.find(p => p.jerseyNumber === jerseyNumber);
      if (jerseyTaken) {
        return res.status(400).json({ message: 'Jersey number already taken' });
      }
    }

    team.players.push({
      player: playerId,
      jerseyNumber,
      role: role || 'player',
    });

    await team.save();
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Lock/Unlock roster
// @route   PUT /api/teams/:id/roster/lock
// @access  Private/Admin
const lockRoster = async (req, res) => {
  try {
    const { locked } = req.body;

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.rosterLocked = locked;
    await team.save();

    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerTeam,
  getTeams,
  getTeamById,
  approveTeam,
  addPlayerToRoster,
  lockRoster,
  
  // @desc    Verify jersey numbers for a team's players before match
  // @route   PUT /api/teams/:id/verify-jerseys
  // @access  Private
  verifyPlayerJerseys: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { playerJerseys } = req.body;
    
    // Find team
    const team = await Team.findById(id);
    if (!team) {
      res.status(404);
      throw new Error('Team not found');
    }
    
    // Update jersey numbers and verification status
    for (const { playerId, jerseyNumber, verified } of playerJerseys) {
      const playerIndex = team.players.findIndex(
        p => p.player.toString() === playerId
      );
      
      if (playerIndex !== -1) {
        if (jerseyNumber) {
          team.players[playerIndex].jerseyNumber = jerseyNumber;
        }
        team.players[playerIndex].jerseyVerified = verified || false;
      }
    }
    
    await team.save();
    
    res.status(200).json({
      success: true,
      data: team,
      message: 'Jersey numbers verified successfully'
    });
  }),
};

