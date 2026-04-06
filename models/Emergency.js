const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  victimId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ["ambulance", "police", "blood", "general"], required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: String, enum: ["active", "accepted", "completed"], default: "active" },
  acceptedHelperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emergency', emergencySchema);
