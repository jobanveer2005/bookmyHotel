const User = require('../models/User');

// @route   GET api/user/me
// @desc    Get current logged-in user's details
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // req.user.id is attached by the authMiddleware
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/user/update
// @desc    Update user details
// @access  Private
exports.updateDetails = async (req, res) => {
    const { name, phone } = req.body;
    
    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (phone) userFields.phone = phone;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update
        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true } // Returns the modified document
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};