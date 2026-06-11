import profileModel from '../model/profile.Model.js';

export const createProfile = async (req, res) => {
  try {
    const { resume_data } = req.body;
    const userId = req.user.userId;

    if (!resume_data) {
      return res.status(400).json({ message: 'resume_data is required' });
    }

    const profile = await profileModel.createProfile(userId, resume_data);
    res.status(201).json({ message: 'Profile created', profile });
  } catch (error) {
    console.error('Error in createProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id, resume_data } = req.body;
    const userId = req.user.userId;

    if (!id || !resume_data) {
      return res.status(400).json({ message: 'id and resume_data are required' });
    }

    const profile = await profileModel.updateProfile(id, userId, resume_data);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found or not yours' });
    }

    res.status(200).json({ message: 'Profile updated', profile });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId    = req.user.userId;
    const { id }    = req.params;
    const profile   = await profileModel.getProfileById(id, userId);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile fetched', profile });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
