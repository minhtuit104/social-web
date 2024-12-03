import axios from "axios";

interface ApiResponse<T> {
    code: number;
    success: boolean;
    message: string;
    data: {
        data: T[];
        pagination: PaginationInfo;
    };
}

export interface PaginationInfo {
    total: number;
    last_page: number;
    page: number;
    pageSize: number;
}




const fetchCommentsById = async (idPost: number, page: number = 1, pageSize: number = 6): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');

    if(!token){
        throw new Error('Token is missing');
    }

    try {
        const response = await axios.get<ApiResponse<any>>(`/api/v1/comments/${idPost}?page=${page}&pageSize=${pageSize}`,{
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