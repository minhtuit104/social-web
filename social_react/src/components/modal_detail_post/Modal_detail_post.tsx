
import IconSend from "../../assets/images/icons/ic_send.svg";
import IconGlobal from "../../assets/images/icons/ic_global.svg";
import IconFriends from "../../assets/images/icons/ic_friends.svg";
import { Modal } from "react-bootstrap";
import "./modal_detail_post.css";
import { useEffect, useState } from "react";
import { addComment, addSubComment, fetchCommentsById } from "../../services/CommentService";
import CommentParent from "../../components/comment_parent";
import CommentChild from "../../components/comment_child";
import { fectchUserName } from "../../services/UserService";
import { useWebSocket } from "../../WebSocket/WebSocketProvider";
import { formatDistanceToNow } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";

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

interface ModalDetailPostProps {
    show: boolean;
    idPost: number;
    title: string;
    image?: string;
    privacy: string;
    createAt: string | Date;
    handleClose: () => void;
    updateCommentCount: (postId: number, newCount: number) => void;

}

const privacyIcons: { [key: string]: string } = {
    Publish: IconGlobal,
    Friends: IconFriends,
};

const ModalDetailPost: React.FC<ModalDetailPostProps> = ({
    show, 
    idPost, 
    handleClose, 
    updateCommentCount,
    title,
    image,
    privacy,
    createAt   
}) => {
    // const {show, handleClose, idPost, updateCommentCount} = props;
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newComment, setNewComment] = useState('');
    const [newSubComment, setNewSubComment] = useState('');
    const [commentId, setCommentId] = useState<number | null>(null);
    const [user, setUser] = useState<any>(null);
    const [totalComment, setTotalComment] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [paginationInfo, setPaginationInfo] = useState<any>(null);

    const { socket, isConnected } = useWebSocket();
    const userInfo = getUserFromToken();
    const idUser = userInfo?.idUser;

    useEffect(() => {
        const getUser = async () => {
            if (idUser) {
                const userData = await fectchUserName(idUser);
                setUser(userData);
            }
        };
        getUser();
    }, [idUser]);

    //hàm fetch comment lấy ra tất cả comment của post
    useEffect(() =>{
        const fetchComments = async () =>{
            if(!idPost){
                console.log('không có idPost');
                return;
            };

            console.log('page hiện tại: ', page);
            setLoading(true);
            console.log('Select post ID: ', idPost);
            try {
                const response = await fetchCommentsById(idPost, page);

                if(response && response.success){
                    const { data: {data: newComments, pagination} } = response;
                    console.log('comments hiện tại: ', newComments);
                    console.log('pagination hiện tại: ', pagination);
                    if(page === 1){
                        setComments(newComments);
                    }else{
                        setComments(prevComments => [...prevComments, ...newComments]);
                    }
                    setPaginationInfo(pagination);
                    setHasMore(page < pagination.last_page);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }finally{
                setLoading(false);
            }
        }
        fetchComments();
    }, [idPost, page]);

    
    //hàm xử lý sự kiện cập nhật số lượng bình luận của post
    useEffect(() => {
        if(socket && isConnected){
            //lắng nghe sự kiện updateTotalComment
            socket.on('updateTotalComment', (data) => {
                if(data.postId === idPost){
                    //cập nhật lại totalComment
                    setTotalComment(data.totalComment);
                    console.log("totalComment: ", data.totalComment);
                }
            });
        }

        return () => {
            if(socket && isConnected){
                socket.off('updateTotalComment');
            }
        }
    }, [socket, idPost]);

    //hàm create comment và gọi thông báo sự kiện khi có bình luận mới
    const handleAddComment = async () => {
        if(!newComment.trim()){
            alert('Please enter a comment before submitting');
            return;
        }
        try {
            if (socket && isConnected) {
                socket.emit('newComment', {
                    idPost,
                    comment: newComment
                });
            } else {
                // Nếu socket không khả dụng, sử dụng API thông thường
                await addComment({
                    idPost,
                    comment: newComment
                });
            }

            // Đảm bảo comment mới tạo có đối tượng subComments trống
            const newCommentWithSubcomments = {
                comment: newComment,
                user: {
                    name: user?.name,
                    avarta: user?.avarta
                },
                createdAt: new Date().toISOString(),
                subComments: [],
            };

            setComments([...comments, newCommentWithSubcomments]); // Thêm comment mới vào danh sách
            setNewComment(''); // reset input sao khi gửi comment
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    const handleShowIdComment = (idComment: number) => {
        console.log('Reply clicked for comment ID:', idComment);
        setCommentId(idComment);    
    }

    //hàm create sub-comment
    const handleAddSubcomment = async (idComment: number) =>{
        if(!newSubComment.trim()){
            console.log('Please enter a sub-comment before submitting');
            return;
        }
        try {
            const data = await addSubComment({
                idComment,
                subcomment: newSubComment,
            });
            //nêý API không ttả về đủ thông tin user thì sẽ fetch lại user
            if(!data.data.user.name || !data.data.user.avarta){
                const userData = await fectchUserName(data.data.user.idUser);
                data.data.user = userData;  //cập nhật lại thông tin user
            }
            console.log("////////////check data: ", data.data);
            const updateComments = comments.map((comment) => {
                if(comment.idComment === idComment){
                    return {
                        ...comment,
                        subComments: [...comment.subComments, data.data],
                    };
                }
                return comment;
            })
            setComments(updateComments);
            setNewSubComment('');
            setCommentId(null);
            
        } catch (error) {
            console.error('Error adding sub-comment:', error);
        }
    }
    

    //hàm cập nhật số lượng bình luận của post
    const handleCloseAndUpdate = () => {
        if (updateCommentCount) {
            updateCommentCount(idPost, comments.length);
        }
        handleClose();
    };


    return (
        <>
        <Modal show={show} onHide={handleCloseAndUpdate} centered size="lg">
            <Modal.Header closeButton>
            <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>Post of {user?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '600px', overflowY: 'auto'}} id="scrollableDiv-detailPost">
                <div className="post-detail-section">
                    <div className="post-author">
                        <img src={user?.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt={user?.name} className="avatar-comment"/>
                        <div className="author-info">
                            <h6>{user?.name}</h6>
                            <span>
                                {createAt ? formatDistanceToNow(new Date(createAt), { addSuffix: true }) : 'Unknown time'}
                                <img src={privacyIcons[privacy]} alt="Privacy" className="ic-18 time-privacy"/>
                            </span>
                        </div>
                    </div>
                    
                    <h5 className="post-title">{title}</h5>

                    <div className="post-images">
                        {image && image.length > 0 ? (
                            (() => {
                                const imageUrls = image.split(',');
                                const imageCount = imageUrls.length;

                                if(imageCount === 1){
                                    return (
                                        <div className="image-detail-container one-image">
                                            <img src={imageUrls[0].trim()} alt="Post image" className="image" loading="lazy"/>
                                        </div>
                                    );
                                }else if(imageCount === 2){
                                    return (
                                        <div className="image-detail-container two-image">
                                            {imageUrls.map((imageUrl, imgIndex) => (
                                                <img key={`img-${imgIndex}`} src={imageUrl.trim()} alt={`Post image ${imgIndex + 1}`} className="image" loading="lazy"/>
                                            ))}
                                        </div>
                                    );
                                }
                                 else if(imageCount === 3){
                                    return (
                                        <div className="image-detail-container three-image">
                                            {imageUrls.map((imageUrl, imgIndex) => (
                                                <img key={`img-${imgIndex}`} src={imageUrl.trim()} alt={`Post image ${imgIndex + 1}`} className="image" loading="lazy"/>
                                            ))}
                                        </div>
                                    );
                                }else{
                                    return imageUrls.slice(0, 3).map((imageUrl, imgIndex) => (
                                        <div className={`image-detail-container ${imgIndex === 2 ? 'large-detail-image' : 'small-detail-image'}`} key={`img-${imgIndex}`}>
                                            <img src={imageUrl.trim()} alt={`Post image ${imgIndex + 1}`} className={`image ${imgIndex === 2 ? 'large-detail-image' : 'small-detail-image'}`} loading="lazy"/>
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
                    <span className="comments-title">Comments:</span>
                    <div className="divider"></div>
                    <div>
                        <InfiniteScroll
                            dataLength={comments.length}
                            next={() => {
                                setTimeout(() => {
                                    setPage(prevPage => prevPage + 1);
                                }, 1000);
                            }}
                            hasMore={hasMore}
                            scrollThreshold={0.8}
                            scrollableTarget ="scrollableDiv-detailPost"
                            loader={<p style={{textAlign: 'center'}}>Loading...</p>}
                            endMessage={<p style={{textAlign: 'center'}}>No more comments</p>}
                        >
                            {comments.length > 0 ? (
                                comments.map((comment: any) => (
                                    <div key={`comment-${comment.idComment}`}>                   
                                        <CommentParent
                                        author={comment.user.name}
                                        comment={comment.comment}
                                        createdAt={comment.createdAt}
                                        avarta={comment.user.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'}
                                        idComment={comment.idComment}
                                        onReplyClick={handleShowIdComment}
                                    />
                                        {/* Hiển thị form nhập sub-comment*/}
                                        {commentId === comment.idComment && (                                  
                                            <div className="subcomment-input">
                                                <img src={comment.user.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt="Tu" className="avatar-comment"/>
                                                <input 
                                                    type="text"
                                                    placeholder="Reply comment..." 
                                                    value={newSubComment}
                                                    onChange={(event) => setNewSubComment(event.target.value)}
                                                />

                                                <button className="send-btn" onClick={() => handleAddSubcomment(comment.idComment)}>
                                                    <img src={IconSend} className="ic-22" alt="Send"/>
                                                </button> 
                                            </div>
                                        )}

                                        {/* hiển thị các sub-comment */}
                                        {comment.subComments && comment.subComments.length > 0 && (
                                            <div className="subcomments">
                                                {comment.subComments.map((subComment: any) => (
                                                    <CommentChild
                                                    key={`subComment-${subComment.idSubcomment}`}
                                                    author={subComment.user.name}
                                                    subcomment={subComment.subcomment}
                                                    createdAt={subComment.createdAt}
                                                    avatar={subComment.user.avarta}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                    </div>                            
                                ))
                            ) : (
                                <p>No comment</p>
                            )}
                        </InfiniteScroll>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>              
                    <img src={user?.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt="Tu" className="avatar-comment"/>
                    <div className="modal-footer-input">
                        <input 
                        type="text" 
                        className="input" 
                        placeholder="You can create comment...."
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                        />
                        <button className="send-btn" onClick={handleAddComment}>
                          <img src={IconSend} className="ic-22" alt="Send"/>
                        </button>
                    </div>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalDetailPost;

