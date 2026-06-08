const Notification = require('../models/Notification');

// Get all notifications for the logged-in user
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 }) // Newest first
      .limit(20) // Only grab the latest 20 so it doesn't slow down
      .populate('sender', 'name') // Assuming your User model has a 'name' field
      .populate('mediaId', 'imageUrl'); // Grab the image so we can show a thumbnail

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

module.exports = { getMyNotifications };