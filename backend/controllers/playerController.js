const Player = require('../models/playerModel');
const User = require('../models/userModel');

// @desc    Register a player
// @route   POST /api/players
// @access  Public
const registerPlayer = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      email,
      phone,
      experience,
      yearsPlaying,
      position,
      jerseyNumber,
      bio,
    } = req.body;

    // Check if user exists with this email
    let user = await User.findOne({ email });
    if (!user) {
      // Create user account for the player
      user = await User.create({
        name,
        email,
        password: 'tempPassword123', // Should be changed later
        role: 'player',
      });
    }

    // Check if player already exists
    const existingPlayer = await Player.findOne({ user: user._id });
    if (existingPlayer) {
      return res.status(400).json({ message: 'Player already registered' });
    }

    // Create player profile
    const player = await Player.create({
      user: user._id,
      name,
      age,
      gender,
      email,
      phone,
      experience: experience || 'beginner',
      yearsPlaying: yearsPlaying || 0,
      position,
      jerseyNumber,
      bio,
    });

    res.status(201).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all players
// @route   GET /api/players
// @access  Public
const getPlayers = async (req, res) => {
  try {
    const players = await Player.find({})
      .populate('user', 'name email')
      .populate('teams.team', 'name')
      .populate('teams.tournament', 'name');
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get player by ID
// @route   GET /api/players/:id
// @access  Public
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('user', 'name email')
      .populate('teams.team', 'name')
      .populate('teams.tournament', 'name')
      .populate('tournamentHistory.tournament', 'name startDate endDate')
      .populate('tournamentHistory.team', 'name');

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update player profile
// @route   PUT /api/players/:id
// @access  Private
const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPlayer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
};

