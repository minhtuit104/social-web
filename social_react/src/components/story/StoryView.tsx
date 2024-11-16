import React, { useEffect, useRef, useState } from "react";
import closeIcon from "../../assets/images/icons/ic_close.svg";
import IconPrevRight from "../../assets/images/icons/ic_pre_right1.svg";
import IconNextRight from "../../assets/images/icons/ic_next.svg";
import "./storyView.css";
import { formatTime } from "../../services/StoryService";
import LeftBar_Story from "./leftBar_story";
import { toast } from "react-toastify";


interface StoryViewProps {
    stories: any[]; //mảng các story
    onClose: () => void; //hàm đóng story view
    onNextUser: () => void; //hàm chuyển sang user tiếp theo
    onPrevUser: () => void; //hàm chuyển sang user trước đó
    currentUserId: number; //id của user đang xem story
    allGroupStories: any; //tất cả các story của các user
    onSelectUser: (userId: number, stories: any[]) => void; //hàm chọn user
}

const StoryView: React.FC<StoryViewProps> = ({stories, onClose, onNextUser, onPrevUser, currentUserId, allGroupStories, onSelectUser}) => {

    const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0); //index cua story hien tai
    const [progress, setProgress] = useState<number>(0); //gia tri progress cua story hien tai (tiến trình % của story)
    const progressInterval = useRef<NodeJS.Timeout | null>(null); //interval de update progress
    const STORY_DURATION = 20000; //thoi gian hien thi cua 1 story
    const PROGRESS_UPDATE_INTERVAL = 100; //thoi gian update progress


    //khi currentStoryIndex thay doi, bat dau qua trinh hien thi story
    useEffect(() => {
        startStoryProgress();
        return () => {
            if(progressInterval.current){
                clearInterval(progressInterval.current);
            }
        };
    },[currentStoryIndex, stories, currentUserId]);

    //bat dau qua trinh hien thi story
    const startStoryProgress = () => {
        setProgress(0);
        if(progressInterval.current){
            clearInterval(progressInterval.current);
        }
        //đảm bảo story tồn tại trước khi bát đầu progress
        if(!stories[currentStoryIndex]){
            toast.error("story does not exist");
            return;
        }
        const startTime = Date.now();
        progressInterval.current = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const newProgress = (elapsedTime / STORY_DURATION) * 100;
            if(newProgress >= 100){
                //chuyen sang story tiep theo
                if(currentStoryIndex < stories.length - 1){
                    setCurrentStoryIndex(prev => prev + 1);
                }else{
                    onNextUser();
                }
            }else{
                setProgress(newProgress);
            }
        }, PROGRESS_UPDATE_INTERVAL);
    };

    //useEffect để reset progress khi chuyển user
    useEffect(() => {
        setProgress(0);
        setCurrentStoryIndex(0);
    }, [currentUserId, stories]);

    //chuyen ve story truoc do
    const handlePrevStory = () => {
        if(currentStoryIndex > 0){
            setCurrentStoryIndex(prev => prev - 1); //chuyen ve story truoc do của user
        } else if (onPrevUser) {
            onPrevUser(); //chuyen ve user truoc do
        }
    };

    //chuyen sang story tiep theo
    const handleNextStory = () => {
        if(currentStoryIndex < stories.length - 1){
            setCurrentStoryIndex(prev => prev + 1);
        }else if(onNextUser){
            onNextUser(); //chuyen sang user tiep theo
        }else{
            onClose();
        }
    };

    useEffect(() => {
        setCurrentStoryIndex(0);
    }, [stories]);

    // Kiểm tra stories và currentStory trước khi render
    if (!stories || stories.length === 0) {
        return null;
    }

    const currentStory = stories[currentStoryIndex];
    if(!currentStory){
        return null;
    }

    return (
        <div className = "story-container">
            <LeftBar_Story 
                allGroupStories={allGroupStories}
                currentUserId={currentUserId}
                onSelectUser={(userId) => {
                    const userStories = allGroupStories[userId] || [];
                    if(userStories.length > 0){
                        setCurrentStoryIndex(0); //chuyen ve story dau tien cua user
                        onSelectUser(userId, userStories);
                    }
                }}
            />
            <div className="story-viewer">
                <div className="story-header">
                    <div className="progress-container">
                        {stories.map((_, index) => (
                            <div key={index} className="progress-bar-container">
                                <div 
                                    className="progress-bar" 
                                    style={{ 
                                        width: `${index === currentStoryIndex ? progress : index < currentStoryIndex ? 100 : 0}%` 
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="user-info">
                        <img src={currentStory.authorId.avarta} alt="user" />
                        <span>{currentStory.authorId.name}</span>
                        <span className="time-ago">{formatTime(currentStory.createdAt)}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <div className="close-icon">
                            <img src={closeIcon} alt="close" className="ic-22"/>
                        </div>
                    </button>
                </div>

                <div className="story-content">
                    <button className="nav-btn prev" onClick={handlePrevStory}>
                        <div className="prev-right">
                            <img src={IconPrevRight} alt="Next" className="ic-18 icon"/>
                        </div>
                    </button>
                    {currentStory.fileType === 'image' ? (
                        <img src={currentStory.image} alt="story" />
                    ) : (
                        <video 
                            src={currentStory.image} 
                            autoPlay 
                            muted 
                            playsInline
                            onEnded={handleNextStory}
                        />
                    )}
                    <button className="nav-btn next" onClick={handleNextStory}>
                        <div className="next-right">
                            <img src={IconNextRight} alt="Next" className="ic-18 icon"/>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StoryView;