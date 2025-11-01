// const cloudinary = require("cloudinary").v2;
// //options ke liye !

// exports.uploadImageToCloudinary =async(file,folder,height, quality ) =>{
//     const options = {folder};
//     if (height) {
//         options.height =height;
//     }
//     if (quality) {
//         options.quality = quality;
//     }
//     options.resource_type = "auto";  //image and video form all type of files upload
//  //cloudinary upload process for all datha upload ! 
//     return await cloudinary.uploader.upload(file.tempFilePath,options);
// }


const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = {
        folder: folder.trim(),  // ← ADD .trim() HERE to remove whitespace
        resource_type: "auto"
    };
    
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }
    
    return await cloudinary.uploader.upload(file.tempFilePath, options);
};