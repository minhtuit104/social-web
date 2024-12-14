import axios from "./axios";

const savePost = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token is missing');

    try {
        const response = await axios.post('/api/v1/saved-posts', { postId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error saving post:', error);
        throw error;
    }
};

const checkIfPostIsSaved = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token is missing');

    try {
        const response = await axios.get(`/api/v1/saved-posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error checking saved status:', error);
        throw error;
    }
};

// Thêm hàm để lấy tất cả trạng thái saved của các bài post
const getAllSavedStatus = async (postIds: number[]) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token is missing');

    try {
        const response = await axios.post('/api/v1/saved-posts/check-multiple', { postIds }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error checking saved status:', error);
        throw error;
    }
};

//lấy danh sách các bài post đã được lưu
const getSavedPosts = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token is missing');

    try {
        const response = await axios.get('/api/v1/saved-posts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Raw API response ===', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching saved posts:', error);
        throw error;
    }
};

export { savePost, checkIfPostIsSaved, getAllSavedStatus, getSavedPosts };