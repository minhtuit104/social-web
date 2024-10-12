import ImgProfile from "../assets/images/tu.jpg";
import IconGlobal from "../assets/images/icons/ic_global.svg";
import IconFriends from "../assets/images/icons/ic_friends.svg";
import IconThreedot from "../assets/images/icons/ic_three-dot.svg";
import IconBookmark from "../assets/images/icons/ic_bookmark.svg";
import IconHide from "../assets/images/icons/ic_hide.svg";
import IconReport from "../assets/images/icons/ic_report.svg";
import IconEdit from "../assets/images/icons/ic_edit.svg";
import IconLike from "../assets/images/icons/ic_like-fillsvg.svg";
import IconLove from "../assets/images/icons/ic_love.svg";
import IconHaha from "../assets/images/icons/ic_haha.svg";
import IconWow from "../assets/images/icons/ic_wow.svg";
import IconSad from "../assets/images/icons/ic_sad.svg";
import IconAngry from "../assets/images/icons/ic_angry.svg";
import IconCmt from "../assets/images/icons/ic_comment.svg";
import IconShare from "../assets/images/icons/ic_share.svg";
import "../assets/css/content_posts.css";
import { useEffect, useRef, useState } from "react";
import ModalComment from "./modal_comment";
import { fetchPosts } from "../services/PostService";
import { formatDistanceToNow } from "date-fns";
import postEventEmitter from "../patternEventEmitter/postEventEmitter";


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

const privacyIcons: { [key: string]: string } = {
    Publish: IconGlobal,
    Friends: IconFriends,
};

const Posts = () => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [isMenuContent, setIsMenuContent] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleShowMenu = () =>{
        setIsMenuContent(!isMenuContent);
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuContent(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //hàm xử lý và hiển thị hình ảnh 
    useEffect(() => {
        // Gọi fetchPosts khi component được mount
        getPosts();

        //lắng nghe sự kiện postCreated
        postEventEmitter.on('postCreated', (newPost: Post) => {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
        });
        //huỷ sự kiện lắng nghe postCreated
        return () => {
            postEventEmitter.removeAllListeners('postCreated'); 
          };
    }, []);

    const getPosts = async () => {
        let res = await fetchPosts();
        if(res && res.data){
            setPosts(res.data);
            console.log("Danh sách bài post:", res.data); 
        } 
    }

    //Show modal comment
    const [isShowModalCmt, setIsShowModalCmt] = useState(false)
    const [selectPostId, setSelectPostId] = useState<number | null>(null);

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
    <div className="main-content">
        <div className="posts">
        {sortedPosts && sortedPosts.length > 0 ? (
            sortedPosts.map((post, index) => (
                <div className="post" key={`post-${index}`}>
                    <div className="post-header">
                        <div className="nav-post">
                            <img src={post.authorId.avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" className="post-profile-image"/>
                            <div className="post-info">
                                <h3>{post.authorId.name}</h3>
                                <p>
                                    {formatDistanceToNow(new Date(post.createAt), { addSuffix: true })}
                                    <img src={privacyIcons[post.privacy]} alt="Privacy" className="ic-18 time-privacy"/></p>
                            </div>
                        </div>
                        
                        <div className="menu-items">
                            <button className="three-dot-btn" onClick={handleShowMenu}>
                                <img src={IconThreedot} alt="Menu" className="ic-22" />
                            </button>
                            <div ref={menuRef} className={`menu-content ${isMenuContent ? 'showmenu' : ''}`}>
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
                        {post.image && post.image.length > 0 ? (
                            post.image.split(',').slice(0,3).map((imageUrl, imgIndex) => (
                                <div className={`image-container ${imgIndex === 2 ? 'large-image' : 'small-image'}`} key={`img-${imgIndex}`}>
                                    <img src={imageUrl.trim()} alt={`Post image ${imgIndex + 1}`} className={`image ${imgIndex === 2 ? 'large-image' : 'small-image'}`}/>
                                    {imgIndex === 2 && post.image.split(',').length > 3 && (
                                        <div className="image-overlay">
                                            +{post.image.split(',').length - 3}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <></>
                        )}                     
                    </div>
                    <div className="post-footer">
                        <div className="like-comment">
                            <div className="main-reaction">
                                <img src={IconLike} className="ic-like-comment" alt="Like" id="mainReaction"/>
                                <span className="feelingCount">{post.totalEmotion}</span>
                                <div className="feeling-options" id="feelingOptions">
                                    <img src={IconLike} alt="Like" className="feeling-icon" data-reaction="like-fillsvg"/>
                                    <img src={IconLove} alt="Love" className="feeling-icon" data-reaction="love"/>
                                    <img src={IconHaha} alt="Haha" className="feeling-icon" data-reaction="haha"/>
                                    <img src={IconWow} alt="Wow" className="feeling-icon" data-reaction="wow"/>
                                    <img src={IconSad} alt="Sad" className="feeling-icon" data-reaction="sad"/>
                                    <img src={IconAngry} alt="Angry" className="feeling-icon" data-reaction="angry"/>
                                </div>
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
    </div>
    {isShowModalCmt && selectPostId && (
        <ModalComment 
        show = {isShowModalCmt}
        idPost = {selectPostId}
        handleClose = {handleClose}
        />
    )}
    
    </>);
};

export default Posts;