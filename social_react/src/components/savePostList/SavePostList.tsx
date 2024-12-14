import { useEffect, useState, useCallback } from 'react';
import { getSavedPosts, savePost } from '../../services/SavePostService';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModalComment from '../modal_comment';
import { useEmotion } from '../UserContext/EmotionByUserContext';
import { useWebSocket } from '../../WebSocket/WebSocketProvider';
import { addEmotion } from '../../services/EmotionService';
import './savePostList.css';
// Import icons
import IconGlobal from "../../assets/images/icons/ic_global.svg";
import IconFriends from "../../assets/images/icons/ic_friends.svg";
import IconLike from "../../assets/images/icons/ic_like-fillsvg.svg";
import IconLikeDefault from "../../assets/images/icons/ic_likedefauth.svg";
import IconLove from "../../assets/images/icons/ic_love.svg";
import IconHaha from "../../assets/images/icons/ic_haha.svg";
import IconWow from "../../assets/images/icons/ic_wow.svg";
import IconSad from "../../assets/images/icons/ic_sad.svg";
import IconAngry from "../../assets/images/icons/ic_angry.svg";
import IconCmt from "../../assets/images/icons/ic_comment.svg";
import IconShare from "../../assets/images/icons/ic_share.svg";

interface Author {
    idUser: number;
    avarta?: string;
    name: string;
}
   
interface Post {
    idPost: number;
    authorId: Author;
    title?: string;
    image?: string;
    privacy: string;
    totalEmotion: number;
    totalComment: number;
    createAt: Date;
}

const privacyIcons: { [key: string]: string } = {
    Publish: IconGlobal,
    Friends: IconFriends,
};

const SavePostList = () => {
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isShowModalCmt, setIsShowModalCmt] = useState(false);
    const [selectPostId, setSelectPostId] = useState<number | null>(null);
    const [isShowEmotionOptions, setIsShowEmotionOptions] = useState<number | null>(null);
    const navigate = useNavigate();
    const { socket, isConnected } = useWebSocket();
    const { reactions, setReactions } = useEmotion();

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await getSavedPosts();
                // console.log('response API===', response);
                if (response) {
                    const posts = response.map((item: any) => item.post);
                    setSavedPosts(posts);
                    // console.log('savedPosts after map===', posts);
                }
            } catch (error) {
                console.error('Error fetching saved posts:', error);
                toast.error('Không thể tải bài viết đã lưu');
            } finally {
                setLoading(false);
            }
        };
        fetchSavedPosts();
    }, []);

    const handleNavigateToProfile = (idUser: number) => {
        navigate(`/profile/${idUser}`);
    };

    const handleShowModalComment = (idPost: number) => {
        setSelectPostId(idPost);
        setIsShowModalCmt(true);
    };

    const handleClose = () => {
        setIsShowModalCmt(false);
        setSelectPostId(null);
    };

    const handleMouseEnter = (idPost: number) => {
        setIsShowEmotionOptions(idPost);
    };

    const handleMouseLeave = () => {
        setIsShowEmotionOptions(null);
    };

    const handleEmotionClick = async (idPost: number, emotion: string) => {
        try {
            const currentEmotion = reactions[idPost];
            const newEmotion = String(currentEmotion) === emotion ? '' : emotion;
            
            if(socket && isConnected) {
                socket.emit('addEmotion', {
                    idPost,
                    emotion: newEmotion
                });
            } else {
                await addEmotion({idPost, emotion: newEmotion});
            }

            setReactions(prev => ({
                ...prev,
                [idPost]: newEmotion
            }));

            setSavedPosts(prevPosts => prevPosts.map(post => {
                if(post.idPost === idPost) {
                    let newTotalEmotion = post.totalEmotion;
                    if(String(currentEmotion) !== newEmotion) {
                        if(!currentEmotion) {
                            newTotalEmotion++;
                        }
                    } else if(currentEmotion && !newEmotion) {
                        newTotalEmotion--;
                    }
                    return {...post, totalEmotion: newTotalEmotion};
                }
                return post;
            }));

            setIsShowEmotionOptions(null);
        } catch (error) {
            console.error('Error handling emotion:', error);
            toast.error('Không thể thực hiện cảm xúc');
        }
    };

    const getEmotionIcon = (emotion: string) => {
        switch(emotion) {
            case 'like': return IconLike;
            case 'love': return IconLove;
            case 'haha': return IconHaha;
            case 'wow': return IconWow;
            case 'sad': return IconSad;
            case 'angry': return IconAngry;
            default: return IconLike;
        }
    };

    const updateCommentCount = useCallback((postId: number, newCount: number) => {
        setSavedPosts(prevPosts => prevPosts.map(post => 
            post.idPost === postId ? {...post, totalComment: newCount} : post
        ));
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
    <div className='savePostlist'>
        <div className="savePostlist-title">
            <span>Saved Posts:</span>
        </div>
        <div className="posts">
            { loading ? (
                <div>Đang tải...</div>
            ) : savedPosts && savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                    <div className="post" key={`save-post-${post.idPost}`}>
                        <div className="post-header">
                            {post.authorId && (
                                <div className="nav-post">
                                    <img 
                                        src={post.authorId.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} 
                                        alt="Profile" 
                                        className="post-profile-image"
                                        onClick={() => handleNavigateToProfile(post.authorId.idUser)}
                                    />
                                <div className="post-info">
                                    <h3 onClick={() => handleNavigateToProfile(post.authorId.idUser)}>
                                        {post.authorId.name}
                                    </h3>
                                    <span>
                                        {formatDistanceToNow(new Date(post.createAt), { addSuffix: true })}
                                        <img 
                                            src={privacyIcons[post.privacy]} 
                                            alt="Privacy" 
                                            className="ic-18 time-privacy"
                                        />
                                    </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p>{post.title}</p>

                        <div className="post-images">
                            {post?.image && post.image.length > 0 ? (
                                (() => {
                                    const imageUrls = post.image.split(',');
                                    const imageCount = imageUrls.length;

                                    if(imageCount === 1){
                                        return (
                                            <div className="image-container single-image">
                                                <img src={imageUrls[0].trim()} alt="Post image" className="image" loading="lazy"/>
                                            </div>
                                        );
                                    }else if(imageCount === 2){
                                        return (
                                            <div className="image-container two-image">
                                                {imageUrls.map((imageUrl, imgIndex) => (
                                                    <img key={`img-${imgIndex}`} src={imageUrl.trim()} alt={`Post image ${imgIndex + 1}`} className="image" loading="lazy"/>
                                                ))}
                                            </div>
                                        );
                                    }
                                    else if(imageCount === 3){
                                        return (
                                            <div className="image-container three-image">
                                                {imageUrls.map((imageUrl, imgIndex) => (
                                                    <img key={`img-${imgIndex}`} src={imageUrl.trim()} alt={`Post image ${imgIndex + 1}`} className="image" loading="lazy"/>
                                                ))}
                                            </div>
                                            );
                                    }else{
                                        return imageUrls.slice(0, 3).map((imageUrl, imgIndex) => (
                                            <div className={`image-container ${imgIndex === 2 ? 'large-image' : 'small-image'}`} key={`img-${imgIndex}`}>
                                                <img src={imageUrl.trim()} alt={`Post image ${imgIndex + 1}`} className={`image ${imgIndex === 2 ? 'large-image' : 'small-image'}`} loading="lazy"/>
                                                {imgIndex === 2 && imageCount > 3 && (
                                                    <div className="image-overlay">
                                                        +{imageCount - 3}
                                                    </div>
                                                )}
                                            </div>
                                        ));
                                    }                        
                                })()
                            ) : (
                                <></>
                            )}                     
                        </div>

                        <div className="post-footer">
                            <div className="like-comment">
                                <div className="emotion-container"
                                    onMouseEnter={() => handleMouseEnter(post.idPost)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="main-reaction">
                                        <img 
                                            src={reactions[post.idPost] ? getEmotionIcon(reactions[post.idPost]) : IconLikeDefault}
                                            className="ic-like-comment ic-like-default"
                                            alt="Reaction"
                                            onClick={() => handleEmotionClick(post.idPost, reactions?.[post.idPost] ? '' : 'like')}
                                        />
                                        <span className="feelingCount">{post.totalEmotion || 0}</span>
                                    </div>
                                    {isShowEmotionOptions === post.idPost && (
                                        <div className="feeling-options">
                                            <img src={IconLike} alt="Like" className="feeling-icon" onClick={() => handleEmotionClick(post.idPost, 'like')}/>
                                            <img src={IconLove} alt="Love" className="feeling-icon" onClick={() => handleEmotionClick(post.idPost, 'love')}/>
                                            <img src={IconHaha} alt="Haha" className="feeling-icon" onClick={() => handleEmotionClick(post.idPost, 'haha')}/>
                                            <img src={IconWow} alt="Wow" className="feeling-icon" onClick={() => handleEmotionClick(post.idPost, 'wow')}/>
                                            <img src={IconSad} alt="Sad" className="feeling-icon" onClick={() => handleEmotionClick(post.idPost, 'sad')}/>
                                            <img src={IconAngry} alt="Angry" className="feeling-icon" onClick={() => handleEmotionClick(post.idPost, 'angry')}/>
                                        </div>
                                    )}
                                </div>
                                <button className="comment-btn" onClick={() => handleShowModalComment(post.idPost)}>
                                    <img src={IconCmt} alt="comment" className="ic-like-comment"/>
                                </button>
                                <span>{post.totalComment}</span>
                            </div>
                            <div className="share">
                                <img src={IconShare} alt="" className="ic-share"/>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-posts">Chưa có bài viết nào được lưu</div>
            )}

            {isShowModalCmt && selectPostId && (
                <ModalComment 
                    show={isShowModalCmt}
                    idPost={selectPostId}
                    handleClose={handleClose}
                    updateCommentCount={updateCommentCount}
                />
            )}
        </div>
    </div>
    );
};

export default SavePostList;