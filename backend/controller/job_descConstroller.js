import job_descriptionModel from '../model/job_description.Model.js';

export const createDescription = async (req, res) => {
  try {
    const { title, company_name, description } = req.body;
    const userId = req.user.userId;

    if (!userId || !title || !company_name || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const jd = await job_descriptionModel.createJob_desc(userId, title, company_name, description);
    return res.status(201).json({ message: 'Job description created', jd });
  } catch (error) {
    console.error('Error in createDescription:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateDescription = async (req, res) => {
  try {
    const { id, title, company_name, description } = req.body;
    const userId = req.user.userId;

    if (!id) return res.status(400).json({ message: 'id is required' });

    const jd = await job_descriptionModel.updateJob_desc(id, userId, title, company_name, description);

    if (!jd) return res.status(404).json({ message: 'Job description not found or not yours' });

    return res.status(200).json({ message: 'Job description updated', jd });
  } catch (error) {
    console.error('Error in updateDescription:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const jd = await job_descriptionModel.deleteJob_desc(id, userId);

    if (!jd) return res.status(404).json({ message: 'Job description not found or not yours' });

    return res.status(200).json({ message: 'Job description deleted successfully', jd });
  } catch (error) {
    console.error('Error in deleteDescription:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
