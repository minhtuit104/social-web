
import IconSend from "../assets/images/icons/ic_send.svg";
import { Modal, Button } from "react-bootstrap";
import "../assets/css/modal_comment.css";
import { useEffect, useState } from "react";
import { addComment, addSubComment, fetchCommentsById } from "../services/CommentService";
import CommentParent from "./comment_parent";
import CommentChild from "./comment_child";
import { fectchUserName } from "../services/UserService";
import { useWebSocket } from "../WebSocket/WebSocketProvider";
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

  interface ModalCommentProps {
    show: boolean;
    idPost: number;
    handleClose: () => void;
    updateCommentCount: (postId: number, newCount: number) => void;
}


const ModalComment: React.FC<ModalCommentProps> = ({show, idPost, handleClose, updateCommentCount}) => {
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

    //hàm fetchComments lấy ra tất cả comment của post
    const fetchComments = async () =>{
        if(!idPost){
            console.log('không có idPost');
            return;
        };

        try {
            setLoading(true);
            
            const response = await fetchCommentsById(idPost, page);
            if(response && response.success){
                const { data: {data: newComments, pagination} } = response;

                if(page === 1){
                    setComments(newComments);
                }else{
                    setComments(prevComments => [...prevComments, ...newComments]);
                }
                setPaginationInfo(pagination);
                setHasMore(page < pagination.last_page);
                //setTotalComment(pagination.total);
            }else{
                console.log('Error fetching or not comments:', response);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchComments();
    }, [idPost, page]);

    // Reset page khi modal đóng
    useEffect(() => {
        if (!show) {
            setPage(1);
            setComments([]);
            setHasMore(true);
        }
    }, [show]);

    //hàm xử lý sự kiện cập nhật số lượng bình luận của post
    useEffect(() => {
        if(socket && isConnected){
            //lắng nghe sự kiện updateTotalComment
            socket.on('updateTotalComment', (data) => {
                if(data.postId === idPost){
                    //cập nhật lại totalComment
                    setTotalComment(data.totalComment);
                }
            });
        }

        return () => {
            if(socket){
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
            if (socket) {
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
        <Modal show={show} onHide={handleCloseAndUpdate} centered size="lg" dialogClassName="modal-comment">
            <Modal.Header closeButton>
            <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '500px' }}>
                <div className="list-comment" id="scrollable-comment">
                    <InfiniteScroll
                        dataLength={comments.length}
                        next={() => {
                            setTimeout(() => {
                                setPage(prevPage => prevPage + 1);
                            }, 1000);
                        }}
                        hasMore={hasMore}
                        scrollThreshold={0.8}
                        loader={<p style={{textAlign: 'center'}}>Loading...</p>}
                        scrollableTarget="scrollable-comment"
                    >
                        <>
                                {comments.map((comment: any) => (
                                    <div key={`comment-${comment.idComment}`}>                   
                                        <CommentParent
                                            author={comment.user.name}
                                            comment={comment.comment}
                                            createdAt={comment.createdAt}
                                            avarta={comment.user?.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'}
                                            idComment={comment.idComment}
                                            onReplyClick={handleShowIdComment}
                                        />
                                        {/* Hiển thị form nhập sub-comment*/}
                                        {commentId === comment.idComment && (                                  
                                            <div className="subcomment-input">
                                                <img src={user?.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt="Tu" className="avatar-comment"/>
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
                                ))}
                        </>
                    </InfiniteScroll>
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

export default ModalComment;