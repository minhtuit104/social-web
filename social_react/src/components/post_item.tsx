import IconGlobal from "../assets/images/icons/ic_global.svg";
import IconFriends from "../assets/images/icons/ic_friends.svg";
import IconThreedot from "../assets/images/icons/ic_three-dot.svg";
import IconBookmark from "../assets/images/icons/ic_bookmark.svg";
import IconHide from "../assets/images/icons/ic_hide.svg";
import IconReport from "../assets/images/icons/ic_report.svg";
import IconEdit from "../assets/images/icons/ic_edit.svg";
import IconDelete from "../assets/images/icons/ic_delete.svg";
import IconLike from "../assets/images/icons/ic_like-fillsvg.svg";
import IconLikeDefault from "../assets/images/icons/ic_likedefauth.svg";
import IconLove from "../assets/images/icons/ic_love.svg";
import IconHaha from "../assets/images/icons/ic_haha.svg";
import IconWow from "../assets/images/icons/ic_wow.svg";
import IconSad from "../assets/images/icons/ic_sad.svg";
import IconAngry from "../assets/images/icons/ic_angry.svg";
import IconCmt from "../assets/images/icons/ic_comment.svg";
import IconShare from "../assets/images/icons/ic_share.svg";

import { useCallback, useEffect, useRef, useState } from "react";
import "../assets/css/content_posts.css";
import ModalComment from "./modal_comment";
import { deletePost, fetchPosts } from "../services/PostService";
import { formatDistanceToNow } from "date-fns";
import postEventEmitter from "../patternEventEmitter/postEventEmitter";
import { addEmotion, getEmotionsByUser } from "../services/EmotionService";
import { useWebSocket } from "../WebSocket/WebSocketProvider";
import { useNavigate } from "react-router-dom";
import { useEmotion } from "./UserContext/EmotionByUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import ModalEditPost from "./modal_edit_Post/modal_edit_post";
import { toast } from "react-toastify";
//định nghĩa interface
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

interface PaginationInfo {
    total: number;
    last_page: number;
    page: number;
    pageSize: number;
}

const privacyIcons: { [key: string]: string } = {
    Publish: IconGlobal,
    Friends: IconFriends,
};


const Post_item = () =>{
    //State
    const [posts, setPosts] = useState<Post[]>([]);
    const [isMenuContent, setIsMenuContent] = useState<number | null>(null);
    const [isShowEmotionOptions, setIsShowEmotionOptions] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
    const [isShowModalCmt, setIsShowModalCmt] = useState(false)
    const [selectPostId, setSelectPostId] = useState<number | null>(null);
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [selectEditPost, setSelectEditPost] = useState<Post | null>(null);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    //hook
    const menuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { socket, isConnected } = useWebSocket();
    const {reactions, setReactions} = useEmotion();

    //hàm giải mã lấy idUser
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

    const user = getUserFromToken();

    
    //hàm chuyển hướng tới trang profile của người dùng
    const handleNavigateToProfile = (idUser: number) => {
        navigate(`/profile/${idUser}`);
    }

    const loadPosts = async () => {
        if (loading || !hasMore) return;
        
        try {
            setLoading(true);
            const response = await fetchPosts(page, 5);
            
            if (response && response.data) {
                const { data: { data: newPosts, pagination } } = response;
                // console.log('New Posts: ', newPosts);
                // console.log('pagination Info: ', pagination);
                
                if (page === 1) {
                    setPosts(newPosts);
                } else {
                    setPosts(prevPosts => [...prevPosts, ...newPosts]);
                }
                setPaginationInfo(pagination);
                setHasMore(page < pagination.last_page);

                
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Effects
    useEffect(() => {   
        loadPosts();
    }, [page]);

    useEffect(() => {
        postEventEmitter.on('postCreated', (newPost: Post) => {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
        });

        postEventEmitter.on('updatePost', (updatedPost: Post) => {
            setPosts((prevPosts) => prevPosts.map(post => 
                post.idPost === updatedPost.idPost ? updatedPost : post
            ));
        });

        return () => {
            postEventEmitter.removeAllListeners('postCreated');
            postEventEmitter.removeAllListeners('updatePost');
        };
    },[])

    // Load emotions
    useEffect(() => {
        const fetchEmotionsByUser = async () => {
            try {
                const res = await getEmotionsByUser();
                if (res && Array.isArray(res)) {
                    const emotionMap = res.reduce((acc: { [key: number]: string }, emotion: any) => {
                        acc[emotion.post.idPost] = emotion.emotion;
                        return acc;
                    }, {});
                    setReactions(emotionMap);
                }
            } catch (error) {
                console.error('Error fetching emotions:', error);
                setReactions({});
            }
        };
        fetchEmotionsByUser();
    }, [setReactions]);

    //hàm xử lý khi người dùng click vào cảm xúc
    const handleEmotionClick = async (idPost: number, emotion: string) => {
        try {
            const currentEmotion = reactions[idPost];
            // Nếu click vào cảm xúc hiện tại, xóa cảm xúc
            const newEmotion = String(currentEmotion) === emotion ? '' : emotion;
            if(socket && isConnected){
                socket.emit('addEmotion', {
                    idPost,
                    emotion: newEmotion
                });
            }else{
                //nếu socket không khả dụng, sử dụng API thông thường
                await addEmotion({idPost, emotion: newEmotion});
            }
    
            setReactions(
                prev => ({
                    ...prev, 
                    [idPost]: newEmotion
                }));
    
            //Cập nhật số lượng cảm xúc trong state posts
            setPosts(prevPosts => prevPosts.map(post => {
                if(post.idPost === idPost){
                    let newTotalEmotion = post.totalEmotion;
                        if(String(currentEmotion) !== newEmotion){ 
                            if(!currentEmotion){
                                newTotalEmotion ++;
                            }
                        }else if(currentEmotion && !newEmotion){
                            newTotalEmotion --;
                        }           
                        return {...post, totalEmotion: newTotalEmotion};
                    }
                    return post;
                }));
            
            setIsShowEmotionOptions(null); // ẩn danh sách cảm xúc sau khi chọn

        } catch (error) {
            console.error('Error fetching emotions:', error);
        }
    };

    const handleMouseEnter = (idPost: number) => {
        setIsShowEmotionOptions(idPost);
    }
    const handleMouseLeave = () => {
        setIsShowEmotionOptions(null);
    }
    // hàm hỗ trợ lấy icon cảm xúc
    const getEmotionCount = (emotion: string) => {
        switch(emotion){
            case 'like': return IconLike;
            case 'love': return IconLove;
            case 'haha': return IconHaha;
            case 'wow': return IconWow;
            case 'sad': return IconSad;
            case 'angry': return IconAngry;
            default: return IconLike;
        }
    };

    //hàm lắng nghe sự kiện cập nhật số lượng cảm xúc của post
    useEffect(() => {
        if(socket && isConnected){
            socket.on('receiveNewEmotion', (data) => {
                setPosts(prevPosts => prevPosts.map(post => 
                    post.idPost === data.idPost 
                        ? {...post, totalEmotion: data.totalEmotion} 
                        : post
                ));
                setReactions(prevReactions => ({...prevReactions, [data.idPost]: data.emotion}));
            });
        }
        return () => {
            if(socket){
                socket.off('receiveNewEmotion');
            }
        };
    }, [socket]);

    //hàm xử lý hiển thị menu (save, hide, report, edit)
    const handleShowMenu = (idPost: number) =>{
        setIsMenuContent((prev) => prev === idPost ? null : idPost);
    };
    const handleClickOutside = (event: MouseEvent) => {
        // Thêm kiểm tra xem click có phải vào nút Edit không
        const target = event.target as HTMLElement;
        const isEditButton = target.closest('.menu-post-btn');
        if (menuRef.current && !menuRef.current.contains(event.target as Node) && !isEditButton) {
            setIsMenuContent(null);
        }
    };

    // Tách riêng hàm xử lý edit để dễ quản lý
    const handleEditPost = (post: Post) => {
        console.log('handleEditPost called with post:', post);
        setSelectEditPost(post);
        setIsShowModalEdit(true);
        setIsMenuContent(null);
    };

    const handleDeletePost = async (post: Post) => {
        const confirm = window.confirm('Are you sure you want to delete this post?');
        if(confirm){
            try {
                setIsDeletingPost(true);
                await deletePost(post.idPost);
                toast.success('Delete post success');
                //cập nhật lại state posts sau khi xóa post
                setPosts(prevPosts => prevPosts.filter(p => p.idPost !== post.idPost));
                //Emit sự kiện để cập nhật lại state posts trên server
                postEventEmitter.emit('postDeleted', post.idPost);
                setIsMenuContent(null); //ẩn menu sau khi xóa post
            } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Delete post failed');
            } finally {
                setIsDeletingPost(false);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    //hàm cập nhật số lượng bình luận của post
    const updateCommentCount = useCallback((postId: number, newCount: number) => {
        setPosts(prevPosts => prevPosts.map(post => 
            post.idPost === postId ? {...post, totalComment: newCount} : post
        ));
    }, []);

    const handleShowModalComment = (idPost: number) => {
        console.log('idPost: ', idPost);
        setSelectPostId(idPost); //cap nhật idPost đã chọn
        setIsShowModalCmt(true);
    }
    const handleClose = () =>{
        setIsShowModalCmt(false);
        setSelectPostId(null); //xóa idPost khi đóng moadal
    }

    //Hàm sắp xếp các bài post theo thời gian mới nhất -> lâu nhất
    const sortedPosts = Array.isArray(posts) ? posts.sort((a, b) => {
        const dateA = new Date(a.createAt);
        const dateB = new Date(b.createAt);
        return dateB.getTime() - dateA.getTime();
    }) : [];
    

    return (
        <>
        <InfiniteScroll
            dataLength={posts.length}
            next={() => {
                setTimeout(() => {
                    setPage(prevPage => prevPage + 1);
                }, 1000);
            }}
            hasMore={hasMore}
            scrollThreshold={0.8}
            scrollableTarget ="scrollableDiv"
            loader={<p style={{textAlign: 'center'}}>Loading...</p>}
            endMessage={<p style={{textAlign: 'center'}}>No more posts</p>}
            >
        
            <div className ="posts">
            
                {sortedPosts && sortedPosts.length > 0 ? (
                    sortedPosts.map((post, index) => (
                        <div className="post" key={`post-${post.idPost || index}`}>
                            <div className="post-header">
                                {post?.authorId && (
                                    <div className="nav-post">
                                        <img src={post.authorId.avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" className="post-profile-image" onClick={() => handleNavigateToProfile(post.authorId.idUser)}/>
                                        <div className="post-info">
                                            <h3 onClick={() => handleNavigateToProfile(post.authorId.idUser)}>{post.authorId.name}</h3>
                                            <span>
                                                {formatDistanceToNow(new Date(post.createAt), { addSuffix: true })}
                                                <img src={privacyIcons[post.privacy]} alt="Privacy" className="ic-18 time-privacy"/>
                                            </span>
                                        </div>
                                    </div>
                                )}
                        
                                <div className="menu-items">
                                    <button className="three-dot-btn" onClick={() => handleShowMenu(post.idPost)}>
                                        <img src={IconThreedot} alt="Menu" className="ic-22" />
                                    </button>
                                    <div ref={menuRef} className={`menu-content ${isMenuContent === post.idPost ? 'showmenu' : ''}`}>
                                        <button className="menu-post-btn">
                                            <img src={IconBookmark} alt="" className="ic-18"/>
                                            <div className="options">
                                                <div>Save</div>
                                                <span>Add this to your saved items.</span>
                                            </div>
                                        </button>
                                        <button className="menu-post-btn">
                                            <img src={IconHide} alt="" className="ic-18"/>
                                            <div className="options">
                                                <div>Hide</div>
                                                <span>Hide this from your news feed.</span>
                                            </div>
                                        </button>
                                        {user?.idUser !== post.authorId.idUser && (
                                            <button className="menu-post-btn">
                                                <img src={IconReport} alt="" className="ic-18" />
                                                <div className="options">
                                                    <div>Report</div>
                                                    <span>We won't let user know who reported this.</span>
                                                </div>
                                            </button>
                                        )}
                                        {user?.idUser === post.authorId.idUser && (
                                            <button className="menu-post-btn" onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditPost(post);
                                            }}>
                                                <img src={IconEdit} alt="" className="ic-18" />
                                                <div className="options">
                                                    <div>Edit</div>
                                                    <span>Edit article as required.</span>
                                                </div>
                                            </button>
                                        )}
                                        {user?.idUser === post.authorId.idUser && (
                                            <button className="menu-post-btn" onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePost(post);
                                            }} 
                                            disabled={isDeletingPost}
                                            >
                                                <img src={IconDelete} alt="" className="ic-18" />
                                                <div className="options">
                                                    <div>Delete</div>
                                                    <span>Delete post as required.</span>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p>{post?.title}</p>
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
                                                src={reactions && reactions[post.idPost] ? getEmotionCount(reactions[post.idPost].toString()) : IconLikeDefault} 
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
                                <button className="comment-btn" onClick={() => handleShowModalComment(post.idPost)}><img src={IconCmt} alt="comment" className="ic-like-comment"/></button>
                                <span>{post.totalComment}</span>
                            </div>
                            <div className="share">
                                <img src={IconShare} alt="" className="ic-share"/>
                            </div>
                        </div>
                    </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
            {isShowModalCmt && selectPostId && (
                <ModalComment 
                    show = {isShowModalCmt}
                    idPost = {selectPostId}
                    handleClose = {handleClose}
                    updateCommentCount = {updateCommentCount}
                />
            )}
            <ModalEditPost
                show = {isShowModalEdit}
                post = {selectEditPost || {} as Post}
                handleClose = {() => {
                    console.log('Closing modal');
                    setIsShowModalEdit(false);
                    setSelectEditPost(null);
                }}
            />
        </InfiniteScroll>
        </>
    );
}

export default Post_item;