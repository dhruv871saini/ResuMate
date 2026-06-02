import job_descriptionModel from "../model/job_description.Model";

export const  createDescription = async(req,res)=>{
    try {
        const {title, company_name, description} =req.body;
        const userId = req.userId;
        if(!userId || !title || !company_name || !description){
            return res.status(400).json({message:"all field are required to full filled"})
        }
        const jd= await job_descriptionModel.createJob_desc(
            userId,
            title,
            company_name,
            description
        )
        return res.status(201).json({message:"job description are created",jd})
    } catch (error) {
        console.error("error in create job description ",error)
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

export const updateDescription = async(req,res) =>{
    try {
        const {id, title, company_name, description} =req.body;
        const userId = req.userId;
        const jd = await job_descriptionModel.updateJob_desc(
            id,
            title,
            company_name,
            description
        )
        return res.status(200).json({message:"job description are updated ", jd})

    } catch (error) {
        console.error("error in update job description ",error)
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

export const deleteDescription=async(req,res)=>{
    try {
        const {id} =req.param;
        const jd= await job_descriptionModel.deleteJob_desc(
        id
        )
        return res.status(200).json({message:"job description are deleted successfully ",jd})
    } catch (error) {
        console.error("error in delete job description ",error)
        return res.status(500).json({
            message: 'Server error'
        });   
    }
}