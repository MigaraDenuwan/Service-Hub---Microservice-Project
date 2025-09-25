const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

// Static routes
router.post('/', providerController.createProvider);
router.get('/', providerController.getAllProviders);
router.get('/by-email', providerController.getProviderByEmail); // <-- must come before dynamic `/:id`

// Availability check
router.get('/check-availability', (req, res) => {
  const { providerId, date, time } = req.query;
  if (providerId && date && time) {
    return res.json({ available: true });
  }
  res.status(400).json({ available: false, message: 'Invalid query' });
});

// Dynamic routes
router.get('/:id', providerController.getProviderById);
router.put('/:id/availability', providerController.updateAvailability);
router.put('/:id/verify', providerController.verifyProvider);
router.post('/:id/reviews', providerController.addReview);

module.exports = router;
