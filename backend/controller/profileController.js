import profileModel from '../model/profile.Model.js'

exports.createProfile = async (req, res) => {
    try {
        const { resume_data } = req.body;
        const userId = req.user.userId; // Get userId from authenticated user
        const profile = await profileModel.createProfile(
            userId,
            resume_data
        )
        res.status(201).json({ message: "profile created", profile })
    } catch (error) {

        res.status(500).json({
            message: 'Server error'
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { id, resume_data } = req.body;
        const userId = req.user.userId; // Get userId from authenticated user
        const profile = await profileModel.updateProfile(
            id,
            userId,
            resume_data
        )
        res.status(200).json({ message: "profile updated", profile })

    } catch (error) {


        res.status(500).json({
            message: 'Server error'
        });
    }

}