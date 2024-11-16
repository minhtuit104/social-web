import IconPlus from "../assets/images/icons/ic_plus.svg";
import IconArrowRight from "../assets/images/icons/ic_arrow-right.svg";
import "../assets/css/right_bar.css";
import { useEffect, useState } from "react";
import ModalCreateStory from "../components/modal_create_story/modal_create_story";
import { fetchAllStories, isStoryActive } from "../services/StoryService";
import StoryItem from "./story/Story_item";
import storyEventEmitter from "../patternEventEmitter/storyEventEmitter";
import StoryView from "./story/StoryView";


//hàm giải mã token lấy id user
const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    }
    return null;
};

const Stories = () => {

    const [stories, setStories] = useState<any[]>([]);
    const [groupStories, setGroupStories] = useState<any>({}); //lưu trữ các story của user được gom nhóm
    const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
    //const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
    const [showStoryView, setShowStoryView] = useState(false);
    const [selectedUserStories, setSelectedUserStories] = useState<any[]>([]); //state để lưu stories của user được chọn
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null); //id của user mà mình xem story
    //const [currentUser, setCurrentUser] = useState<number>(1); 

    const user = getUserFromToken();
    const currentUser = user?.idUser;

    useEffect(() => {
        loadStories();
    }, []);

    //thêm useEffect để gom nhóm các story của user
    useEffect(() => {
        const grouped = stories.reduce((acc: any, story: any) => {
            const userId = story.authorId.idUser;
            if (!acc[userId]) {
                acc[userId] = [];
            }
            acc[userId].push(story);
            return acc;
        }, {});
        console.log('Grouped Stories: ', grouped);
        setGroupStories(grouped);
    }, [stories]);

    //hàm lắng nghe sự kiện khi tạo story
    useEffect(() => {
        storyEventEmitter.on('storyCreated', (newStory: any) => {
            setStories((prevStories) => {
                const storyExists = prevStories.some((story: any) => story.idStory === newStory.idStory);
                if(storyExists) {
                    return prevStories;
                }
                return [newStory, ...prevStories];
            });
        });

        return () => {
            storyEventEmitter.removeAllListeners('storyCreated');
        };
    }, []);

    const loadStories = async () => {
        try {
            setLoading(true);
            const response = await fetchAllStories();
            console.log('danh sach cac story: ', response);
            if (response && response.data) {
                const validStories = response.data.map((story: any) => ({
                    ...story,
                    createdAt: new Date(story.createdAt)
                })).filter((story: any) => isStoryActive(story.createdAt));
                setStories(validStories);
            }       
        } catch (error) {
            console.error('Error loading stories:', error);
        } finally {
            setLoading(false);
        }
    };

    //hàm xử lý khi click vào 1 story
    const handleStoryClick = (userId: number) => {
        console.log('Click userId: ', userId);
        const userStories = groupStories[userId] || [];
        console.log('User Stories: ', userStories);
        if (userStories.length > 0) {
            setCurrentUserId(userId);
            setSelectedUserStories(userStories);
            setShowStoryView(true);
        }
    };

    const handleNextUser = () => {
        if(currentUserId){
            //tạo mảng userIds theo thứ tự currentUser, otherUser (user đăng nhập đầu tiên)
            const allUserIds = Object.keys(groupStories).map(Number);
            const otherUserIds = allUserIds.filter(id => id !== currentUser);
            const orderedUserIds = currentUser ? [currentUser, ...otherUserIds] : otherUserIds;


            const currentIndex = orderedUserIds.indexOf(currentUserId);
            if(currentIndex < orderedUserIds.length - 1){
                const nextUserId = orderedUserIds[currentIndex + 1];
                setCurrentUserId(nextUserId);
                setSelectedUserStories(groupStories[nextUserId] || []);
            } else {
                handleCloseStoryView();
            }
        }
    }

    const handlePrevUser = () => {
        if(currentUserId){
            //tạo mảng userIds theo thứ tự currentUser, otherUser (user đăng nhập đầu tiên)
            const allUserIds = Object.keys(groupStories).map(Number);
            const otherUserIds = allUserIds.filter(id => id !== currentUser);
            const orderedUserIds = currentUser ? [currentUser, ...otherUserIds] : otherUserIds;

            const currentIndex = orderedUserIds.indexOf(currentUserId);
            if(currentIndex > 0){
                const prevUserId = orderedUserIds[currentIndex - 1];
                setCurrentUserId(prevUserId);
                setSelectedUserStories(groupStories[prevUserId] || []);
            }
        }
    }

    //hàm xử lý khi close story view
    const handleCloseStoryView = () => {
        setShowStoryView(false);
        setSelectedUserStories([]);
    };

    const renderStoriesList = () => {
        if(!groupStories || Object.keys(groupStories).length === 0){
            return null;
        }
        const myStories = groupStories[currentUser] || [];
        const otherStories = Object.entries(groupStories)
        .filter(([userId]) => Number(userId) !== currentUser)
        .map(([userId, stories]) => ({userId: Number(userId), stories}));

        return (
            <div className="stories-list">
                {/* Render story của bản thân trước */}
                {myStories.length > 0 && (
                    <div 
                        key={`story-${currentUser}`} 
                        onClick={() => handleStoryClick(currentUser)}
                    >
                        <StoryItem 
                            story={myStories[0]}
                            isCurrentUser={true} // Thêm prop để style khác biệt nếu cần
                        />
                    </div>
                )}

                {/* Render stories của người khác */}
                {otherStories.map(({userId, stories}) => (
                    <div 
                        key={`story-${userId}`} 
                        onClick={() => handleStoryClick(userId)}
                    >
                        <StoryItem 
                            story={(stories as any[])[0]}
                            isCurrentUser={false}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (<>
            <div className="right-sidebar">
                <div className="stories">
                    <div className="stories-header">
                        <h3>Stories</h3>
                    </div>
                    <div className="stories-body">
                        <div className="story-item" onClick={() => setShowCreateStoryModal(true)}>
                            <div className="create-story">
                                <div className="ic-create-str">
                                    <img src={IconPlus} alt="create" className="ic-22"/>
                                </div>
                                <div className="document">
                                    Create story
                                </div>
                            </div>
                        </div>
                        {/* <div className="stories-list">
                            {Object.entries(groupStories).map(([userId, userStories]) => (
                                    <div key={`story-${userId}`} onClick={() => handleStoryClick(Number(userId))}>
                                        <StoryItem 
                                            story={(userStories as any[])[0]} 
                                        />
                                    </div>
                            ))}
                        </div> */}
                        {renderStoriesList()}
                        <div className="arrow-right">
                            <img src={IconArrowRight} alt="Next" className="ic-18"/>
                        </div>
                    </div>
                </div>
            </div>
            <ModalCreateStory 
                show={showCreateStoryModal} 
                handleClose={() => setShowCreateStoryModal(false)}
                onStoryCreated={(newStory: any) => {
                    storyEventEmitter.emit('storyCreated', newStory);
                }}
            />
            {showStoryView && selectedUserStories.length > 0 && (
                <StoryView 
                    stories={selectedUserStories}
                    onClose={handleCloseStoryView}
                    onNextUser={handleNextUser}
                    onPrevUser={handlePrevUser}
                    currentUserId={currentUserId!}
                    allGroupStories={groupStories}
                    onSelectUser={(userId, stories) => {
                        setCurrentUserId(userId);
                        setSelectedUserStories(stories);
                    }}
                />
            )}
    </>);

};

export default Stories;