import React from "react";

interface StoryItemProps {
    story: {
        idStory: number;
        image: string;
        fileType: 'image' | 'video';
        createdAt: Date | string;
        authorId: {
            idUser: number;
            avarta: string;
            name: string;
        };
    };
    isCurrentUser?: boolean;
}

const StoryItem: React.FC<StoryItemProps> = ({story, isCurrentUser = false}) => {
    return (
        <div>
            <div className="story-item">
                <img src={story.image} alt="story-img" />
                <div className="story-info">
                    <img src={story.authorId.avarta} alt="taminhtu" />
                    <span>{isCurrentUser ? 'Your story' : story.authorId.name}</span>
                </div>
            </div>
        </div>
    )
}

export default StoryItem;