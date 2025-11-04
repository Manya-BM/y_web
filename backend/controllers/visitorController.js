const Visitor = require('../models/visitorModel');
const Tournament = require('../models/tournamentModel');

// @desc    Register a visitor
// @route   POST /api/visitors
// @access  Private/Admin
const registerVisitor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      organization,
      tournamentId,
      accessLevel,
      notes,
    } = req.body;

    // Check if tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if visitor already registered
    const existingVisitor = await Visitor.findOne({ email, tournament: tournamentId });
    if (existingVisitor) {
      return res.status(400).json({ message: 'Visitor already registered for this tournament' });
    }

    const visitor = await Visitor.create({
      name,
      email,
      phone,
      organization,
      tournament: tournamentId,
      accessLevel: accessLevel || 'guest',
      registeredBy: req.user._id,
      notes,
    });

    // Add visitor to tournament
    tournament.visitors.push(visitor._id);
    await tournament.save();

    res.status(201).json(visitor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all visitors for a tournament
// @route   GET /api/visitors
// @access  Private/Admin
const getVisitors = async (req, res) => {
  try {
    const { tournamentId } = req.query;
    let query = {};
    if (tournamentId) {
      query.tournament = tournamentId;
    }

    const visitors = await Visitor.find(query)
      .populate('tournament', 'name startDate endDate')
      .populate('registeredBy', 'name email');

    res.json(visitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check-in visitor
// @route   PUT /api/visitors/:id/checkin
// @access  Private/Admin
const checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    visitor.checkedIn = true;
    visitor.checkedInAt = new Date();
    await visitor.save();

    res.json(visitor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerVisitor,
  getVisitors,
  checkInVisitor,
};

