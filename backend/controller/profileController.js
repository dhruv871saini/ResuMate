import profileModel from '../model/profile.Model.js'

export const createProfile = async (req, res) => {
    try {
        const { resume_data } = req.body;
        const userId = req.user.userId; // Get userId from authenticated user
        const profile = await profileModel.createProfile(
            userId,
            resume_data
        )
        res.status(201).json({ message: "profile created", profile })
    } catch (error) {
        console.error("error in create profile ",error)
        res.status(500).json({
            message: 'Server error'
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { id, resume_data } = req.body;
        const userId = req.user.userId;
        const profile = await profileModel.updateProfile(
            id,
            resume_data
        )
        res.status(200).json({ message: "profile updated", profile })

    } catch (error) {
        console.error("error in update profile ",error)

        res.status(500).json({
            message: 'Server error'
        });
    }

}

export const getProfile = async (req,res)=>{
    console.log("bla bla mt kar kaam kar")
}