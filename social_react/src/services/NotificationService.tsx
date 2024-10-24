import axios from "./axios";

const fetchNotificationsByIdUser = async (idUser: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is missing');
        return;
    }

    try {
        // Gọi API với token trong header Authorization
        const response = await axios.get(`/api/v1/notifications/${idUser}`, {
            headers: {
            Authorization: `Bearer ${token}` 
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error; // Ném lỗi để xử lý sau này
    }
};

export default fetchNotificationsByIdUser;