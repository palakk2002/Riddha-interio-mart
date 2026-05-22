const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  clockInShift, 
  clockOutShift, 
  getLiveOffers, 
  acceptOffer, 
  rejectOffer 
} = require('../controllers/dispatchController');

const router = express.Router();

router.put('/clock-in', protect, clockInShift);
router.put('/clock-out', protect, clockOutShift);
router.get('/offers', protect, getLiveOffers);
router.post('/offers/:eventId/accept', protect, acceptOffer);
router.post('/offers/:eventId/reject', protect, rejectOffer);

module.exports = router;
