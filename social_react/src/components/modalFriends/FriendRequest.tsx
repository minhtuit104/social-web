import { formatDistanceToNow } from "date-fns";
import "./friendRequest.css";
import { useState } from "react";
import { acceptFriendRequest, rejectFriendRequest } from "../../services/FriendService";
import { toast } from "react-toastify";

interface FriendRequestProps {
    friend: {
        id: number;
        user: {
            idUser: number;
            avarta?: string;
            name: string;
        };
        createdAt: string;
    };
    onAccept: (idUser: number) => Promise<void>;
    onDecline: (idUser: number) => Promise<void>;
}

const FriendRequest: React.FC<FriendRequestProps> = ({friend, onAccept, onDecline}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleAction = async (action: 'accept' | 'decline') => {
        if (isRemoving) return;
        setIsLoading(true);
        setIsRemoving(true);
        try {
            if (action === 'accept') {
                await acceptFriendRequest(friend.user.idUser);
                setTimeout(() => {
                    onAccept(friend.user.idUser);
                }, 500);
            } else {
                await rejectFriendRequest(friend.user.idUser);
                setTimeout(() => {
                    onDecline(friend.user.idUser);
                }, 500);
            }
        } catch (error: any) {
            setIsRemoving(false);
            setIsLoading(false);
            toast.error(error.message || 'Đã xảy ra lỗi, vui lòng thử lại sau');
        }
    }
    return (<>
        <div className={`friend-request-item ${isRemoving ? 'removing' : ''}`}>
            <div className="Avatar">
                <img 
                src={friend.user.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} 
                alt="avatar" 
                className="avatar-friend-request"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://www.gravatar.com/avatar/?d=mp';
                }}
                 />
            </div>
            <div className="Info">
                <div className="Name">
                    <span className="name">{friend.user.name}</span>
                    <span className="createdAt">
                        {formatDistanceToNow(new Date(friend.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <div className="Button">
                    <button onClick={() => handleAction('accept')} disabled={isLoading} className="accept-button">{isLoading ? 'Đang xử lý...' : 'Accept'}</button>
                    <button onClick={() => handleAction('decline')} disabled={isLoading} className="decline-button">{isLoading ? 'Đang xử lý...' : 'Decline'}</button>
                </div>
            </div>
        </div>
    </>);
}

export default FriendRequest;