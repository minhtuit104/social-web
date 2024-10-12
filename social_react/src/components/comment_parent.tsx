import { useState } from "react";
import IconSend from "../assets/images/icons/ic_send.svg";
import "../assets/css/modal_comment.css";
import { formatDistanceToNow } from "date-fns";


interface CommentParentProps {
    idComment: number;
    author: string;
    comment: string;
    createdAt: Date;
    avarta: string;
    onReplyClick: (idComment: number) => void;
}

const CommentParent = ({idComment,author, comment, createdAt, avarta, onReplyClick}: CommentParentProps) => {

    return(<>
        <div className="comment-parent">
            <div className="comment-parent-header">
                <img src={avarta} alt={author}/>
                <div className="comment-info">
                    <h3>{author}</h3>
                    <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                </div>
            </div>
            <div className="comment-content">
                <p>{comment}</p>
            </div>
            <div className="comment-footer">
                <button>Like</button>
                <button onClick={() => onReplyClick(idComment)}>Reply</button>
            </div>                
        </div>
    </>)
}

export default CommentParent;