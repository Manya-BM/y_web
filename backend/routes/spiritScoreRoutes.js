const express = require('express');
const router = express.Router();
const {
  submitSpiritScore,
  getTeamSpiritScores,
  getMatchSpiritScores
} = require('../controllers/spiritScoreController');
const { protect, teamManager, tournamentDirector, techTeam } = require('../middleware/authMiddleware');

// Submit a spirit score - requires team manager or tournament director
router.post('/', protect, teamManager, submitSpiritScore);

// Get spirit scores for a team - public access
router.get('/team/:teamId', getTeamSpiritScores);

// Get spirit scores for a match - public access
router.get('/match/:matchId', getMatchSpiritScores);

module.exports = router;