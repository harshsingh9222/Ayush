import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        //upload file to cloudinary
        const res= await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto',
        })

        fs.unlinkSync(localFilePath)
        return res;
    }
    catch(err){
        fs.unlinkSync(localFilePath,(err)=>{
            if(err) console.log('Error deleting local file',err);
            console.log('Local file deleted successfully');
        })
        console.log(err);
        return null;
    }
}

export {uploadOnCloudinary};