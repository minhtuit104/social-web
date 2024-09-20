import axios from "./axios";


const loginApi = (email: string, password: string) => {
    return axios.post('/api/v1/auth/login', {email, password});
};

const registerApi = (name: string, email: string, birthday: string, password: string) => {
    return axios.post('/api/v1/auth/register', { name, email, birthday, password });
};

const fectchUserName = async (idUser: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing');
        return;
    }

    try {

        const response =  await axios.get(`/api/v1/users/${idUser}`, {
            headers: {
                Authorization: `Bearer ${token}` 
            },
        });
        return response.data;

    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};


export {loginApi, registerApi, fectchUserName};