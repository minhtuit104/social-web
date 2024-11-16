import IconGlobal from "../../assets/images/icons/ic_global.svg";
import IconFriends from "../../assets/images/icons/ic_friends.svg";
import IconThreedot from "../../assets/images/icons/ic_three-dot.svg";
import IconBookmark from "../../assets/images/icons/ic_bookmark.svg";
import IconHide from "../../assets/images/icons/ic_hide.svg";
import IconReport from "../../assets/images/icons/ic_report.svg";
import IconEdit from "../../assets/images/icons/ic_edit.svg";
import IconLike from "../../assets/images/icons/ic_like-fillsvg.svg";
import IconLove from "../../assets/images/icons/ic_love.svg";
import IconHaha from "../../assets/images/icons/ic_haha.svg";
import IconWow from "../../assets/images/icons/ic_wow.svg";
import IconSad from "../../assets/images/icons/ic_sad.svg";
import IconAngry from "../../assets/images/icons/ic_angry.svg";
import IconCmt from "../../assets/images/icons/ic_comment.svg";
import IconShare from "../../assets/images/icons/ic_share.svg";
import '../../assets/css/content_posts.css';
import { useCallback, useEffect, useRef, useState } from "react";
import ModalComment from "../modal_comment";
import { fetchPostByIdUser } from "../../services/PostService";
import { formatDistanceToNow } from "date-fns";
import postEventEmitter from "../../patternEventEmitter/postEventEmitter";
import { addEmotion } from "../../services/EmotionService";
import { useWebSocket } from "../../WebSocket/WebSocketProvider";
import { useUser } from "../UserContext/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";


interface Author {
    avarta: string;
    name: string;
  } 
interface Post {
    idPost: number;
    authorId: Author;
    title: string;
    image: string;
    privacy: string;
    totalEmotion: number;
    totalComment: number;
    createAt: Date;
  }

interface MyPostsProps {
    idUser: number;
}

interface PaginationInfo {
    total: number;
    last_page: number;
    pageSize: number;
    page: number;
}

const privacyIcons: { [key: string]: string } = {
    Publish: IconGlobal,
    Friends: IconFriends,
};

const MyPosts: React.FC<MyPostsProps> = ({idUser}) => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { userAvatar } = useUser();
    const socket = useWebSocket();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isMenuContent, setIsMenuContent] = useState<number | null>(null);
    const [reactions, setReactions] = useState<{ [key: string]: number }>({});
    const [isShowEmotionOptions, setIsShowEmotionOptions] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
     //Show modal comment
    const [isShowModalCmt, setIsShowModalCmt] = useState(false)
    const [selectPostId, setSelectPostId] = useState<number | null>(null);
    


    const loadPosts = async () => {
        if(loading) return;

        try {
            setLoading(true);
            const response = await fetchPostByIdUser(idUser, page);

            if(response && response.data){
                const { data: {data: newPosts, pagination} } = response;
                console.log('danh sach post cua user:', newPosts);
                if(page === 1){
                    setPosts(newPosts);
                }else{
                    setPosts(prevPosts => [...prevPosts, ...newPosts]);
                }
                setPaginationInfo(pagination);
                setHasMore(page < pagination.last_page);
            }
        }catch (error) {
            console.error('Error fetching posts:', error);
        }finally{
            setLoading(false);
        }
    }

    //hàm xử lý lấy danh sách post của người dùng
    useEffect(() => {
        loadPosts();
    }, [page]);

    useEffect(() => {
        //lắng nghe sự kiện postCreated
        postEventEmitter.on('postCreated', (newPost: Post) => {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
        });
        //huỷ sự kiện lắng nghe postCreated
        return () => {
            postEventEmitter.removeAllListeners('postCreated'); 
          };
    }, []);

    //hàm xử lý khi người dùng click vào cảm xúc
    const handleEmotionClick = async (idPost: number, emotion: string) => {
        try {
            const currentEmotion = reactions[idPost];
            // Nếu click vào cảm xúc hiện tại, xóa cảm xúc
            const newEmotion = String(currentEmotion) === emotion ? '' : emotion;
            if(socket){
                socket.emit('addEmotion', {
                    idPost,
                    emotion: newEmotion
                });
            }else{
                    //nếu socket không khả dụng, sử dụng API thông thường
                await addEmotion({idPost, emotion});
            }
    
            setReactions(prevReactions => ({...prevReactions, [idPost]: newEmotion}));
    
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
        if(socket){
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

    const handleShowMenu = (idPost: number) =>{
        setIsMenuContent((prev) => prev === idPost ? null : idPost);
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuContent(null);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, []);

    //hàm cập nhật số lượng bình luận của post
    const updateCommentCount = useCallback((postId: number, newCount: number) => {
        setPosts(prevPosts => prevPosts.map(post => 
            post.idPost === postId ? {...post, totalComment: newCount} : post
        ));
    }, []);   


    const handleShowModalComment = (idPost: number) => {
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

    return(<>
        <InfiniteScroll
            dataLength={posts?.length || 0}
            next={() => {
                setTimeout(() => {
                    setPage(prevPage => prevPage + 1);
                }, 1000);
            }}
            hasMore={hasMore}
            scrollThreshold={0.8}
            scrollableTarget ="scrollableDiv-myPosts"
            loader={<p style={{textAlign: 'center'}}>Loading...</p>}
            endMessage={<p style={{textAlign: 'center'}}>No more posts</p>}
        >
            <div className="posts">
                {sortedPosts && sortedPosts.length > 0 ? (
                    sortedPosts.map((post, index) => (
                        <div className="post" key={`post-${index}`}>
                            <div className="post-header">
                                <div className="nav-post">
                                    <img src={ userAvatar ?? post.authorId?.avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" className="post-profile-image"/>
                                    <div className="post-info">
                                        <h3>{post.authorId?.name}</h3>
                                        <span>
                                            {formatDistanceToNow(new Date(post.createAt), { addSuffix: true })}
                                            <img src={privacyIcons[post.privacy]} alt="Privacy" className="ic-18 time-privacy"/>
                                        </span>
                                    </div>
                                </div>
                        
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
                                        <button className="menu-post-btn">
                                            <img src={IconReport} alt="" className="ic-18" />
                                            <div className="options">
                                                <div>Report</div>
                                                <span>We won't let user know who reported this.</span>
                                            </div>
                                        </button>
                                        <button className="menu-post-btn">
                                            <img src={IconEdit} alt="" className="ic-18" />
                                            <div className="options">
                                                <div>Edit</div>
                                                <span>Edit article as required.</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p>{post.title}</p>
                            <div className="post-images">
                                {post.image && (
                                    (() => {
                                        const imageUrls = post.image.split(',').filter(url => url.trim());
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
                                        }else if(imageCount === 3){
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
                                                src={reactions[post.idPost] ? getEmotionCount(reactions[post.idPost].toString()) : IconLike} 
                                                className="ic-like-comment" 
                                                alt="Reaction"
                                                onClick={() => handleEmotionClick(post.idPost, reactions[post.idPost] ? '' : 'like')}
                                            />
                                        <span className="feelingCount">{post.totalEmotion}</span>
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
                ):(
                    <></>
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
        </InfiniteScroll>
    </>);
};

export default MyPosts;