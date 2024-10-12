import ImgTu from "../assets/images/tu.jpg";
import ImgLuan from "../assets/images/luan.jpg";
import IconSend from "../assets/images/icons/ic_send.svg";
import { Modal, Button } from "react-bootstrap";
import "../assets/css/modal_comment.css";
import { useEffect, useState } from "react";
import { addComment, addSubComment, fetchCommentsById } from "../services/CommentService";
import CommentParent from "./comment_parent";
import CommentChild from "./comment_child";
import { fectchUserName } from "../services/UserService";


const ModalComment = (props: any) => {
    const {show, handleClose, idPost} = props;
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newComment, setNewComment] = useState('');
    const [newSubComment, setNewSubComment] = useState('');
    const [commentId, setCommentId] = useState<number | null>(null);

    useEffect(() =>{

        const fetchComments = async () =>{
            if(idPost){
                setLoading(true);
                console.log('Select post ID: ', idPost);
                try {
                    const data = await fetchCommentsById(idPost);
                    setComments(data);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }finally{
                    setLoading(false);
                }
            }
        }
        fetchComments();
    }, [idPost]);

    const handleAddComment = async () => {
        if(!newComment.trim()){
            console.log('Please enter a comment before submitting');
            return;
        }
        try {
            //gọi api thông qua CommentService
            const data =  await addComment({
                    idPost,
                    comment: newComment
            })
            console.log("/////check res: ", data.data);

            //đảm bảo comment mới tạo có đối tượng subComments trống
            const newCommentWithSubcomment ={
                ...data.data,
                subComments: [],
            }
            setComments([...comments, newCommentWithSubcomment]); //thêm comment mới vào danh sách
            setNewComment(''); // reset input sao khi gửi comment

        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    const handleShowIdComment = (idComment: number) => {
        console.log('Reply clicked for comment ID:', idComment);
        setCommentId(idComment);    
    }

    //hàm create
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


    return (
        <>
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
            <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '500px', overflowY: 'auto' }}>
                <div>
                    {loading ? (
                        <p>Loading comments...</p>
                    ): comments.length > 0 ? (
                        comments.map((comment: any) => (
                            <div key={comment.idComment}>                   
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
                                            key={subComment.idSubcomment}
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
                </div>
            </Modal.Body>
            <Modal.Footer>              
                    <img src={ImgTu} alt="Tu" className="avatar-comment"/>
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