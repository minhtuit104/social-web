import axios from './axios';

//hàm gửi lời mời kết bạn
const sendFriendRequest = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');
    }
    try {
        const response = await axios.post(`/api/v1/friends/send-request/${friendId}`, {
        }, {
        headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('response là:-----', response);
        return response.data;
    } catch (error) {
        console.error('Error sending friend request:', error);
        throw error;
    }
}

//Hàm hủy yêu cầu kết bạn
const cancelFriendRequest = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');  
    }
    try {
        const response = await axios.post(`/api/v1/friends/cancel-request/${friendId}`, {
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error canceling friend request:', error);
        throw error;
    }
}

//hàm lấy danh sách lời mời kết bạn được nhận
const getFriendRequest = async (page: number = 1, pageSize: number = 10) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');
    }
    try {
        const response = await axios.get(`/api/v1/friends/friend-request?page=${page}&pageSize=${pageSize}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error getting friend request:', error);
        throw error;
    }
}

//hàm kiểm tra lời mời kết bạn có tồn tại?
const checkFriendRequestStatus = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');
    }
    try {
        const response = await axios.get(`/api/v1/friends/check-friend-request/${friendId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('checkFriendRequestStatus:----->', response.data);
        if(response.status.toString() === 'success') {
            return response.data;
        }
        return true; //trả về false nếu có lỗi
    } catch (error) {
        console.error('Error checking friend request status:', error);
        throw error;
    }
}

//hàm chấp nhận lời mời kết bạn
const acceptFriendRequest = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');
    }
    try {
        //kiem tra trạng thái trước khi chấp nhận
        // const isValid = await checkFriendRequestStatus(friendId);
        // if(!isValid) {
        //     throw new Error('Lời mời kết bạn đã hết hạn');
        // }
        const response = await axios.post(`/api/v1/friends/accept-request/${friendId}`, {
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error accepting friend request<3 <3:', error);
        throw error;
    }
}

//hàm từ chối lời mời kết bạn
const rejectFriendRequest = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');
    }
    try {
        //kiem tra trạng thái trước khi từ chối
        // const isValid = await checkFriendRequestStatus(friendId);
        // if(!isValid) {
        //     throw new Error('Lời mời kết bạn đã hết hạn');
        // }
        const response = await axios.post(`/api/v1/friends/reject-request/${friendId}`, {
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error rejecting friend request <3 <3:', error);
        throw error;
    }   
}

//hàm kiểm tra trạng thái bạn bè
const checkFriendshipStatus = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');
    }
    try {
        const response = await axios.get(`/api/v1/friends/check-status/${friendId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('checkFriendshipStatus:----->', response.data);
        return response.data;
    } catch (error) {
        console.error('Error checking friendship status:', error);
        throw error;
    }

}

//hàm xóa bạn bè
const deleteFriend = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');
    }
    try {
        const response = await axios.delete(`/api/v1/friends/delete/${friendId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting friend:', error);
        throw error;
    }
}

//hàm lấy danh sách bạn bè
const getFriends = async (page: number = 1, pageSize: number = 10) => {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error('Token is not found');
    }
    try {
        const response = await axios.get(`/api/v1/friends/friend-list?page=${page}&pageSize=${pageSize}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error getting friends:', error);
        throw error;
    }
}


export { sendFriendRequest, getFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, checkFriendshipStatus, deleteFriend, getFriends, checkFriendRequestStatus };

