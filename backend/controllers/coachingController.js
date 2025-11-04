const Child = require('../models/childModel');

// @desc    Get all children
// @route   GET /api/coaching/children
// @access  Private/Coach
const getChildren = async (req, res) => {
  try {
    let query = {};
    
    // If user is a coach, only show their assigned children
    if (req.user.role === 'coach') {
      query.coach = req.user._id;
    }
    
    const children = await Child.find(query);
    res.json(children);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get child by ID
// @route   GET /api/coaching/children/:id
// @access  Private/Coach
const getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    // Check if user is authorized to view this child
    if (req.user.role !== 'admin' && child.coach.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(child);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new child record
// @route   POST /api/coaching/children
// @access  Private/Coach
const createChild = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      community,
      joinDate,
      active
    } = req.body;

    const child = await Child.create({
      name,
      age,
      gender,
      community,
      joinDate,
      active: active || true,
      coach: req.user._id
    });

    if (child) {
      res.status(201).json(child);
    } else {
      res.status(400).json({ message: 'Invalid child data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update child record
// @route   PUT /api/coaching/children/:id
// @access  Private/Coach
const updateChild = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    // Check if user is authorized to update this child
    if (req.user.role !== 'admin' && child.coach.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedChild = await Child.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedChild);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Record attendance
// @route   POST /api/coaching/children/:id/attendance
// @access  Private/Coach
const recordAttendance = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    // Check if user is authorized
    if (req.user.role !== 'admin' && child.coach.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { date, present, notes } = req.body;
    
    child.attendance.push({
      date,
      present,
      notes,
      recordedBy: req.user._id
    });
    
    await child.save();
    res.status(201).json(child);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Record LSAS assessment
// @route   POST /api/coaching/children/:id/lsas
// @access  Private/Coach
const recordLSAS = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    // Check if user is authorized
    if (req.user.role !== 'admin' && child.coach.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { category, score, notes, date } = req.body;
    
    child.lsasScores.push({
      category,
      score,
      notes,
      date: date || Date.now(),
      assessedBy: req.user._id
    });
    
    await child.save();
    res.status(201).json(child);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getChildren,
  getChildById,
  createChild,
  updateChild,
  recordAttendance,
  recordLSAS
};