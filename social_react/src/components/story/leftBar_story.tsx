import React from "react";
import "./leftBar_story.css";

interface LeftBar_StoryProps {
    allGroupStories: any; //tất cả các story của các user
    currentUserId: number; //id của user đang xem story
    onSelectUser: (userId: number) => void; //hàm chọn user
}


const LeftBar_Story: React.FC<LeftBar_StoryProps> = ({allGroupStories, currentUserId, onSelectUser}) => {

    // Lấy currentUser từ token
    const getUserFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window.atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        }
        return null;
    };

    const user = getUserFromToken();
    const loggedInUserId = user?.idUser;

    // Chuyển đổi object groupStories thành mảng và sắp xếp với currentUser đầu tiên
    const usersList = Object.entries(allGroupStories).map(([userId, stories]: [string, any]) => ({
        userId: Number(userId),
        user: (stories as any[])[0].authorId,
        stories: stories
    })).sort((a, b) => {
        if (a.userId === loggedInUserId) return -1;
        if (b.userId === loggedInUserId) return 1;
        return 0;
    });

    return (
        <div className="left-bar-story">
            <div className = "left-bar-header">
                <span>Stories</span>
            </div>
            <div className="users-list">
                {usersList.map((item) => (
                    <div 
                        key={item.userId}
                        className={`user-item ${item.userId === currentUserId ? 'actived' : ''}`}
                        onClick={() => onSelectUser(item.userId)}
                    >
                        <div className="user-avatar-left-bar">
                            <img src={item.user.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt={item.user.name} />
                        </div>
                        <div className="user-info-left-bar">
                            <span className="user-name">{item.userId === loggedInUserId ? 'Your story' : item.user.name}</span>
                            <span className="story-count">{item.stories.length} new card</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LeftBar_Story;