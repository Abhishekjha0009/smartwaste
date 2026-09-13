import User from '../models/User.js';

// @desc    Get all active workers for assignment list
// @route   GET /api/users/workers
// @access  Private (Authority / Admin)
export const getWorkers = async (req, res, next) => {
  try {
    const workers = await User.find({ role: 'Worker' }).select('-password');
    res.json({ success: true, count: workers.length, workers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin view)
// @route   GET /api/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role & details
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const { name, role, assignedZone, phone, isAvailable } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (assignedZone) user.assignedZone = assignedZone;
    if (phone) user.phone = phone;
    if (isAvailable !== undefined) user.isAvailable = isAvailable;

    await user.save();
    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
};
