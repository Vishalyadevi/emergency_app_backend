const User = require('../models/User');
const Notification = require('../models/Notification');
const { calculateDistance } = require('../utils/haversine');

exports.getNearbyHelpers = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const helpers = await User.find({
      role: { $in: ["helper", "both"] },
      isAvailable: true,
      _id: { $ne: req.user.id }
    }).select('name phone services latitude longitude');

    const nearbyHelpers = helpers
      .map(helper => {
        const dist = calculateDistance(Number(latitude), Number(longitude), helper.latitude, helper.longitude);
        return {
          ...helper.toObject(),
          distance: dist
        };
      })
      .filter(helper => helper.distance <= 10)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyHelpers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCityHelpers = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    const helpers = await User.find({
      city: { $regex: new RegExp(city, 'i') },
      role: { $in: ["helper", "both"] }
    }).select('name phone services city');

    res.json(helpers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .populate('emergencyId')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
