const express = require('express');
const router = express.Router();
const {
  registerTeam,
  getTeams,
  getTeamById,
  approveTeam,
  addPlayerToRoster,
  lockRoster,
  verifyPlayerJerseys,
} = require('../controllers/teamController');
const { protect, tournamentDirector } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTeams)
  .post(protect, registerTeam);

router.route('/:id')
  .get(getTeamById);

router.route('/:id/approve')
  .put(protect, tournamentDirector, approveTeam);

router.route('/:id/roster')
  .post(protect, addPlayerToRoster);

router.route('/:id/roster/lock')
  .put(protect, tournamentDirector, lockRoster);

router.route('/:id/verify-jerseys')
  .put(protect, verifyPlayerJerseys);

module.exports = router;

