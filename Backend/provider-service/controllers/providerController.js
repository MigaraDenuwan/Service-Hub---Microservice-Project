const Provider = require('../models/Provider');

exports.createProvider = async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json(provider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find();
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProviderByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const provider = await Provider.find({ email });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { availability: req.body.availability },
      { new: true }
    );
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    provider.reviews.push(req.body);
    await provider.save();
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};