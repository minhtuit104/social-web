import { formatDistanceToNow } from "date-fns";
import "../assets/css/modal_comment.css";


interface CommentChildProps {
    author: string;
    subcomment: string;
    createdAt: Date;
    avatar: string;
}

const CommentChild = ({author, subcomment, createdAt, avatar }: CommentChildProps) => {

    return (<>
        <div className="comment-child">
            <div className="comment-child-header">
                <img src={avatar} alt={author}/>
                <div className="comment-info">
                    <h3>{author}</h3>
                    <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                </div>
            </div>
            <div className="comment-content">
                <p>{subcomment}</p>                
            </div>
            <div className="comment-footer">
                <button>Like</button>
                <button>Reply</button>
            </div>                
        </div>
    </>)
}

export default CommentChild;