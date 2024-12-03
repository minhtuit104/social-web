import IconPlus from "../assets/images/icons/ic_plus.svg";
import IconArrowRight from "../assets/images/icons/ic_next.svg";
import IconArrowLeft from "../assets/images/icons/ic_pre_right1.svg";
import "../assets/css/right_bar.css";
import { useEffect, useRef, useState } from "react";
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
    const storiesBodyRef = useRef<HTMLDivElement>(null);
    const [showArrowLeft, setShowArrowLeft] = useState(false);


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
        // console.log('Grouped Stories: ', grouped);
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

    //hàm load stories 
    const loadStories = async () => {
        try {
            setLoading(true);
            const response = await fetchAllStories();
            // console.log('danh sach cac story: ', response);
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
                            isCurrentUser={true} 
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

    // hàm kiểm tra xem có hiển thị mũi tên scroll left hay không
    useEffect(() => {
        const checkShowArrowLeft = () => {
            if(storiesBodyRef.current){
                const scrollLeft = storiesBodyRef.current.scrollLeft;
                setShowArrowLeft(scrollLeft > 0);
            }
        }
        const storiesBody = storiesBodyRef.current;
        if(storiesBody){
            storiesBody.addEventListener('scroll', checkShowArrowLeft);
            window.addEventListener('resize', checkShowArrowLeft);
        }
        return () => {
            if(storiesBody){
                storiesBody.removeEventListener('scroll', checkShowArrowLeft);
                window.removeEventListener('resize', checkShowArrowLeft);
            }
        };
    }, [stories]);

    //hàm xử lý scroll right
    const handleScrollRight = () => {
        if(storiesBodyRef.current){
            const scrollAmount = 2000;
            storiesBodyRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    //hàm xử lý scroll left
    const handleScrollLeft = () => {
        if(storiesBodyRef.current){
            storiesBodyRef.current.scrollBy({
                left: -2000,
                behavior: 'smooth'
            });
        }
    };

    return (<>
            <div className="right-sidebar">
                <div className="stories">
                    <div className="stories-header">
                        <h3>Stories</h3>
                    </div>
                    <div className = "stories-wrapper">
                        {/* hiển thị mũi tên scroll left */}
                        {showArrowLeft && (
                            <div className="arrow-left" onClick={handleScrollLeft}>
                                <img src={IconArrowLeft} alt="arrow-left" className="ic-22"/>
                            </div>
                        )}
                        <div className="stories-body" ref={storiesBodyRef}>
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
                            
                            {/* render list story */}
                            {renderStoriesList()}

                        </div>
                        {/* hiển thị mũi tên scroll right */}
                        <div className="arrow-right" onClick={handleScrollRight}>
                            <img src={IconArrowRight} alt="arrow-right" className="ic-22"/>
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