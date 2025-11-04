const express = require('express');
const router = express.Router();
const {
  registerVisitor,
  getVisitors,
  checkInVisitor,
} = require('../controllers/visitorController');
const { protect, tournamentDirector } = require('../middleware/authMiddleware');

router.use(protect);
router.use(tournamentDirector);

router.route('/')
  .get(getVisitors)
  .post(registerVisitor);

router.route('/:id/checkin')
  .put(checkInVisitor);

module.exports = router;

