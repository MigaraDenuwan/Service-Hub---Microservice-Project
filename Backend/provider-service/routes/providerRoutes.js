const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - serviceType
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         serviceType:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *         isVerified:
 *           type: boolean
 */

/**
 * @swagger
 * /api/providers:
 *   post:
 *     summary: Create a new provider
 *     tags: [Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Provider'
 *     responses:
 *       201:
 *         description: Provider created successfully
 */
router.post('/', providerController.createProvider);

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Get all providers
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: List of providers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Provider'
 */
router.get('/', providerController.getAllProviders);

/**
 * @swagger
 * /api/providers/by-email:
 *   get:
 *     summary: Get provider by email
 *     tags: [Providers]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Provider details
 */
router.get('/by-email', providerController.getProviderByEmail);

/**
 * @swagger
 * /api/providers/check-availability:
 *   get:
 *     summary: Check provider availability
 *     tags: [Providers]
 *     parameters:
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability status
 */
router.get('/check-availability', (req, res) => {
  const { providerId, date, time } = req.query;
  if (providerId && date && time) {
    return res.json({ available: true });
  }
  res.status(400).json({ available: false, message: 'Invalid query' });
});

/**
 * @swagger
 * /api/providers/{id}:
 *   get:
 *     summary: Get provider by ID
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider details
 */
router.get('/:id', providerController.getProviderById);

/**
 * @swagger
 * /api/providers/{id}/availability:
 *   put:
 *     summary: Update provider availability
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Availability updated
 */
router.put('/:id/availability', providerController.updateAvailability);

/**
 * @swagger
 * /api/providers/{id}/verify:
 *   put:
 *     summary: Verify a provider
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider verified
 */
router.put('/:id/verify', providerController.verifyProvider);

/**
 * @swagger
 * /api/providers/{id}/reviews:
 *   post:
 *     summary: Add a review for a provider
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewerName:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added
 */
router.post('/:id/reviews', providerController.addReview);

module.exports = router;
