const express = require('express');
const router = express.Router();
const { 
  createTournament, 
  getTournaments, 
  getTournamentById, 
  updateTournament, 
  deleteTournament 
} = require('../controllers/tournamentController');
const { generateSchedule } = require('../controllers/matchController');
const { protect, tournamentDirector } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTournaments);
router.get('/:id', getTournamentById);

// Protected routes
router.post('/', protect, tournamentDirector, createTournament);
router.put('/:id', protect, tournamentDirector, updateTournament);
router.delete('/:id', protect, tournamentDirector, deleteTournament);

// Schedule generation
router.post('/:id/schedule', protect, tournamentDirector, generateSchedule);

module.exports = router;