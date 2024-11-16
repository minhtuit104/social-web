import React from "react";
import "./leftBar_story.css";

interface LeftBar_StoryProps {
    allGroupStories: any; //tất cả các story của các user
    currentUserId: number; //id của user đang xem story
    onSelectUser: (userId: number) => void; //hàm chọn user
}


const LeftBar_Story: React.FC<LeftBar_StoryProps> = ({allGroupStories, currentUserId, onSelectUser}) => {

    // Chuyển đổi object groupStories thành mảng và sắp xếp với currentUser đầu tiên
    const usersList = Object.entries(allGroupStories).map(([userId, stories]: [string, any]) => ({
        userId: Number(userId),
        user: (stories as any[])[0].authorId,
        stories: stories
    }));

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
                            <img src={item.user.avarta} alt={item.user.name} />
                        </div>
                        <div className="user-info-left-bar">
                            <span className="user-name">{item.user.name}</span>
                            <span className="story-count">{item.stories.length} new card</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LeftBar_Story;