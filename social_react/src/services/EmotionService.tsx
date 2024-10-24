import axios from "./axios";

const addEmotion = async (data: {idPost: number, emotion: string}) => {
    const token = localStorage.getItem('token');
    if(!token){
        console.log('token is missing');
        return;
    }
    try {
        const response = await axios.post('/api/v1/emotions', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

const fetchEmotionsByPost = async (idPost: number) => { 
    const token = localStorage.getItem('token');
    if(!token){
        console.log('token is missing');
        return;
    }   
    try {
        const response = await axios.get(`/api/v1/emotions/${idPost}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching emotions:', error);
        throw error;
    }
};

export { addEmotion, fetchEmotionsByPost };
