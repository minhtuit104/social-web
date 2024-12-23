import axios from "./axios";

interface CreateStoryDto {
    image: string;
    fileType: 'image' | 'video';
}

//tạo story
const createStory = async (storyData: CreateStoryDto) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token is missing');
    }

    try {
        const response = await axios.post('/api/v1/stories', storyData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error creating story:', error);
        throw error;
    }
};

//lấy tất cả các story trong 24h gần nhất
const fetchAllStories = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token is missing');
    }

    try {
        const response = await axios.get('/api/v1/stories', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching stories:', error);
        throw error;
    }
};

//lấy story của 1 user
const fetchStoryByUserId = async (userId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token is missing');
    }

    try {
        const response = await axios.get(`/api/v1/stories/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching story by user id:', error);
        throw error;
    }
};

// hàm helper kiểm tra xem story còn hiệu lực hay không
const isStoryActive = (createdAt: Date | string): boolean => {
    const storyDate = new Date(createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - storyDate.getTime()) / (60 * 60 * 1000);
    return diffHours <= 24;
};

// hàm helper để format thời gian
const formatTime = (createdAt: Date | string): string => {
    const now = new Date();
    const storyDate = new Date(createdAt);
    const diffMinutes = Math.floor((now.getTime() - storyDate.getTime()) / (60 * 1000));

    if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
        return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
        return `${Math.floor(diffMinutes / 1440)} days ago`;
    }
};



export { createStory, fetchAllStories, fetchStoryByUserId, isStoryActive, formatTime };
