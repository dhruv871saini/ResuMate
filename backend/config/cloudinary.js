
import { v2 as cloudinary } from 'cloudinary';
 
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});
 
export default cloudinary;



// CLOUDINARY_URL=cloudinary://586493736966322:xCPzO76YRDVc7IxWW9JPDFzbZM8@deskpl2k8
// Cloud name	
// deskpl2k8
// API key	
// 586493736966322
// API secret	
// xCPzO76YRDVc7IxWW9JPDFzbZM8