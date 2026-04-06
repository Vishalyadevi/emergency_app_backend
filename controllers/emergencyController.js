const Emergency = require('../models/Emergency');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { calculateDistance } = require('../utils/haversine');

exports.createEmergency = async (req, res) => {
  try {
    const { type, latitude, longitude } = req.body;
    const victimId = req.user.id;

    const emergency = new Emergency({
      victimId,
      type,
      latitude,
      longitude
    });

    await emergency.save();

    // Notify nearby helpers
    const query = {
        role: { $in: ["helper", "both"] },
        isAvailable: true,
        _id: { $ne: victimId }
    };

    if (type !== 'general') {
        query.services = type;
    }

    const allHelpers = await User.find(query);
    const nearbyHelpers = allHelpers
      .map(helper => ({
        ...helper.toObject(),
        distance: calculateDistance(latitude, longitude, helper.latitude, helper.longitude)
      }))
      .filter(helper => helper.distance <= 5)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 15);

    for (const helper of nearbyHelpers) {
      const victim = await User.findById(victimId);
      const newNotification = new Notification({
        userId: helper._id,
        message: `🚨 Emergency: ${type.toUpperCase()} alert from ${victim.name}. Location: ${latitude}, ${longitude}`,
        emergencyId: emergency._id
      });
      await newNotification.save();
    }

    res.status(201).json({ emergency, notifiedHelpersCount: nearbyHelpers.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.acceptEmergency = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    const helperId = req.user.id;

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    if (emergency.status !== 'active') {
      return res.status(400).json({ message: 'Emergency already accepted or completed' });
    }

    emergency.status = 'accepted';
    emergency.acceptedHelperId = helperId;
    await emergency.save();

    const helper = await User.findById(helperId);
    const newNotification = new Notification({
        userId: emergency.victimId,
        message: `✅ Your emergency has been accepted by ${helper.name}. They are on their way!`,
        emergencyId: emergency._id
    });
    await newNotification.save();

    res.json(emergency);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getEmergencyStatus = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id)
            .populate('victimId', 'name phone')
            .populate('acceptedHelperId', 'name phone latitude longitude');
        if (!emergency) {
            return res.status(404).json({ message: 'Emergency not found' });
        }
        res.json(emergency);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
