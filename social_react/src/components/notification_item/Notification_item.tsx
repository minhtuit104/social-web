// import React from 'react';
import './notification_item.css';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
    notification: {
        id: number;
        message: string;
        updatedAt: string;
        isRead: boolean;
        post?: {
            idPost: number;
            title: string;
            privacy: string;
            createAt:  Date;
            image: string;
        };
        sender: {
            avarta: string;
            name: string;
        };
    };
    onNotificationClick: (notification: any) => void;
}


const NotificationItem: React.FC<NotificationItemProps> = ({notification, onNotificationClick}) => {
    const handleClick = () => {
        onNotificationClick(notification);
    }
    return (
        <div className={`notification-item ${notification.isRead ? '' : 'unread'}`} onClick={handleClick}>
            <div className="notification-item-top">
                <img src={notification.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt="avatar" className="avatar-notification" />
                <span className="notification-text">{notification.message}</span>
            </div>
            <div className="notification-item-bottom">
                <span className="notification-time">{formatDistanceToNow(new Date(notification.updatedAt), { addSuffix: true })}</span>
            </div>
        </div>
    );
};

export default NotificationItem;