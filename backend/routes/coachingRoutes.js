const express = require('express');
const router = express.Router();
const { 
  getChildren, 
  getChildById, 
  createChild, 
  updateChild, 
  recordAttendance, 
  recordLSAS 
} = require('../controllers/coachingController');
const { protect, teamManager } = require('../middleware/authMiddleware');

router.use(protect);
router.use(teamManager);

router.route('/children')
  .get(getChildren)
  .post(createChild);

router.route('/children/:id')
  .get(getChildById)
  .put(updateChild);

router.route('/children/:id/attendance')
  .post(recordAttendance);

router.route('/children/:id/lsas')
  .post(recordLSAS);

module.exports = router;