import { Link } from "react-router-dom";
import "./friend_item.css";
interface FriendItemProps {
    friend: {
        idUser: number;
        name: string;
        avarta: string;
        email: string;
    };
}

const FriendItem = ({ friend }: FriendItemProps) => {
    return (<>
        <div className="friend-item">
            <div className="friend-info">
                <Link to={`/profile/${friend.idUser}`}>
                    <img 
                        src={friend.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} 
                        alt={friend.name} 
                        className="friend-avatar"
                    />
                </Link>
                <div className="friend-details">
                    <Link to={`/profile/${friend.idUser}`} className="friend-name">
                        {friend.name}
                    </Link>
                    <span className="friend-username">{friend.email}</span>
                </div>
            </div>
        </div>
    </>);
}

export default FriendItem;