const express = require('express');
const router = express.Router();
const { 
  createMatch, 
  getMatches, 
  getMatchById, 
  updateMatch, 
  updateScore, 
  addScoringEvent, 
  addMatchPhoto,
  deleteMatchPhoto 
} = require('../controllers/matchController');
const { protect, tournamentDirector } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getMatches);
router.get('/:id', getMatchById);

// Protected routes
router.post('/', protect, tournamentDirector, createMatch);
router.put('/:id', protect, tournamentDirector, updateMatch);
router.put('/:id/score', protect, updateScore);
router.post('/:id/score-event', protect, addScoringEvent);
router.post('/:id/photos', protect, upload.single('photo'), addMatchPhoto);
router.delete('/:id/photos/:photoId', protect, deleteMatchPhoto);

module.exports = router;