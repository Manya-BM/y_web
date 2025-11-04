const Tournament = require('../models/tournamentModel');

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({}).sort({ startDate: -1 });
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tournament by ID
// @route   GET /api/tournaments/:id
// @access  Public
const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate({
        path: 'teams',
        select: 'name players status jerseyColors statistics'
      })
      .populate({
        path: 'matches',
        select: 'field startTime endTime status round scores',
        populate: [
          { path: 'team1', select: 'name' },
          { path: 'team2', select: 'name' }
        ]
      })
      .populate('organizer', 'name email');

    if (tournament) {
      res.json(tournament);
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a tournament
// @route   POST /api/tournaments
// @access  Private/Admin
const createTournament = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      rules,
      startDate,
      endDate,
      location,
      address,
      maxTeams,
      registrationDeadline,
      banner,
      sponsors,
      fields,
      spiritScoreEnabled,
    } = req.body;

    const tournament = await Tournament.create({
      name,
      title,
      description,
      rules,
      startDate,
      endDate,
      location,
      address,
      maxTeams,
      registrationDeadline,
      banner,
      sponsors: sponsors || [],
      fields: fields || [],
      organizer: req.user._id,
      status: 'upcoming',
      spiritScoreEnabled: spiritScoreEnabled !== undefined ? spiritScoreEnabled : true,
    });

    if (tournament) {
      res.status(201).json(tournament);
    } else {
      res.status(400).json({ message: 'Invalid tournament data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add announcement to tournament
// @route   POST /api/tournaments/:id/announcements
// @access  Private/Admin
const addAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    tournament.announcements.push({
      title,
      content,
      postedBy: req.user._id,
    });

    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add field to tournament
// @route   POST /api/tournaments/:id/fields
// @access  Private/Admin
const addField = async (req, res) => {
  try {
    const { name, fieldNumber, location, capacity } = req.body;
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    tournament.fields.push({
      name,
      fieldNumber,
      location,
      capacity,
      schedule: [],
    });

    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Private/Admin
const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if user is tournament organizer or admin
    if (tournament.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add team to tournament
// @route   POST /api/tournaments/:id/teams
// @access  Private
const addTeamToTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const { teamName, captain, players } = req.body;

    // Check if tournament is full
    if (tournament.teams.length >= tournament.maxTeams) {
      return res.status(400).json({ message: 'Tournament is full' });
    }

    // Check if team already exists
    const teamExists = tournament.teams.find(team => team.name === teamName);
    if (teamExists) {
      return res.status(400).json({ message: 'Team already registered' });
    }

    tournament.teams.push({
      name: teamName,
      captain,
      players,
      registeredBy: req.user._id
    });

    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @access  Private/Admin
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if user is tournament organizer or admin
    if (tournament.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tournament removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  addTeamToTournament,
  addAnnouncement,
  addField,
};