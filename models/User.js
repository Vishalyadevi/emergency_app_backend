const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: false },
  city: { type: String, required: true },
  role: { type: String, enum: ["victim", "helper", "both"], required: true },
  services: [{ type: String, enum: ["ambulance", "police", "blood"] }],
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
