const User = require('../models/User');

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, isAvailable } = req.body;
    const updateData = { latitude, longitude };
    
    if (typeof isAvailable !== 'undefined') {
        updateData.isAvailable = isAvailable;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getHelperLocation = async (req, res) => {
    try {
        const helper = await User.findById(req.params.helperId).select('latitude longitude name phone');
        if (!helper) {
            return res.status(404).json({ message: 'Helper not found' });
        }
        res.json(helper);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
