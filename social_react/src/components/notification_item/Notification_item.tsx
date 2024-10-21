// import React from 'react';
import './notification_item.css';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({notification}: {notification: any}) => {
    return (
        <div className="notification-item">
            <div className="notification-item-top">
                <img src={notification.sender.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt="avatar" className="avatar-notification" />
                <span className="notification-text">{notification.message}</span>
            </div>
            <div className="notification-item-bottom">
                <span className="notification-time">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
            </div>
        </div>
    );
};

export default NotificationItem;