const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: false },
  phone: { type: String, required: true },
  serviceType: { type: String, required: true },
  address: { type: String },
  isVerified: { type: Boolean, default: false },
  availability: [AvailabilitySchema],
  reviews: [ReviewSchema],
}, { timestamps: true });

module.exports = mongoose.model('Provider', ProviderSchema);
