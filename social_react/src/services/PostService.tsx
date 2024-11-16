import axios from "./axios";

const fetchPosts = async (page: number = 1, pageSize: number = 5) =>{
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token is missing');
    }
    
    try {
        // Gọi API với token trong header Authorization
        const response = await axios.get(`/api/v1/posts?page=${page}&pageSize=${pageSize}`, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; // Ném lỗi để xử lý sau này
    }
};

const createPost = async (postData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token is missing');
    }

    try {

        const response =  await axios.post('/api/v1/posts', postData, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        return response;

    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

const fetchPostByIdUser = async (idUser: number, page: number = 1, pageSize: number = 10) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing');
        return;
    }

    try {
        const response = await axios.get(`/api/v1/posts/user/${idUser}?page=${page}&pageSize=${pageSize}`, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export {fetchPosts, createPost, fetchPostByIdUser};