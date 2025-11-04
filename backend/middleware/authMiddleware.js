const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Tournament Director middleware (Full Admin)
const tournamentDirector = (req, res, next) => {
  if (req.user && req.user.role === 'tournament_director') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a tournament director');
  }
};

// Team Manager middleware
const teamManager = (req, res, next) => {
  if (req.user && (req.user.role === 'team_manager' || req.user.role === 'tournament_director')) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a team manager');
  }
};

// Field Official middleware
const fieldOfficial = (req, res, next) => {
  if (req.user && (req.user.role === 'field_official' || req.user.role === 'tournament_director' || req.user.role === 'tech_team')) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a field official');
  }
};

// Tech Team middleware
const techTeam = (req, res, next) => {
  if (req.user && (req.user.role === 'tech_team' || req.user.role === 'tournament_director')) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a tech team member');
  }
};

// Player middleware (for player-specific actions)
const player = (req, res, next) => {
  if (req.user && ['player', 'team_manager', 'tournament_director'].includes(req.user.role)) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a player');
  }
};

module.exports = { protect, tournamentDirector, teamManager, fieldOfficial, techTeam, player };