import axios from "./axios";

const getMessageWithUser = (userId1: number, userId2: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing');
        return;
    }
    return axios.get(`/api/v1/messagers/${userId1}/${userId2}`, {
        headers: {
            Authorization: `Bearer ${token}` 
        },
    });
};

export {getMessageWithUser};
