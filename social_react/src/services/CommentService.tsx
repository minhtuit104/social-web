import axios from "axios";

const fetchCommentsById = async (idPost: number) => {
    const token = localStorage.getItem('token');

    if(!token){
        console.log('token is missing');
        return;
    }

    try {
        const response = await axios.get(`/api/v1/comments/${idPost}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; //ném lỗi để xử lý 
    }

};

const addComment = async (data: {idPost: number, comment: string}) => {
    const token = localStorage.getItem('token');
    if(!token){
        console.log('token is missing');
        return;
    }

    try {
        const response = await axios.post(`/api/v1/comments/`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
   
}

const addSubComment = async (data: {idComment: number, subcomment: string}) => {
    const token = localStorage.getItem('token');
    if(!token){
        console.log('token is missing');
        return;
    }

    try {
        const response = await axios.post(`/api/v1/subcomments/`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

export {fetchCommentsById, addComment, addSubComment};