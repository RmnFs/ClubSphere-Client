import axios from "axios";


const image_hosting_key = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export const imageUpload = async (image) => {
    const formData = new FormData();
    formData.append('image', image);
    
    try {
        const res = await axios.post(image_hosting_api, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
}
