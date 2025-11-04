const express = require('express');
const router = express.Router();
const {
  registerPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
} = require('../controllers/playerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPlayers)
  .post(registerPlayer);

router.route('/:id')
  .get(getPlayerById)
  .put(protect, updatePlayer);

module.exports = router;

