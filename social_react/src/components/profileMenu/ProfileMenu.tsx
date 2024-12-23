import "./profileMenu.css";
import IconUser from "../../assets/images/icons/ic_userInfo.svg";
import IconFeed from "../../assets/images/icons/ic_news.svg";
import IconNotification from "../../assets/images/icons/ic_notifications.svg";
import IconMessage from "../../assets/images/icons/ic_message.svg";
import IconImage from "../../assets/images/icons/ic_library.svg";
import IconVideo from "../../assets/images/icons/ic_video.svg";
import IconBookmark from "../../assets/images/icons/ic_bookmark.svg";
import IconMusic from "../../assets/images/icons/ic_music2.svg";
import IconQuestion from "../../assets/images/icons/ic_question.svg";
import IconCourse from "../../assets/images/icons/ic_courses.svg";
import ImgUser1 from "../../assets/images/luan1.jpg";
import ImgUser2 from "../../assets/images/tcdoan.png";
import CloseFriend from "../closeFriend/CloseFriend";

const ProfileMenu = () => {
    return (<>
        <div className="profileMenu">
            <div className="profileMenuWrapper">
                <ul className="profileMenuList">
                    <li className="profileMenuItem">
                        <img src={IconUser} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Tạ Minh Tú</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconFeed} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">My new feed</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconNotification} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Notifications</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconMessage} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Messages</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconImage} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Images</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconVideo} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Videos</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconBookmark} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Bookmarks</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconQuestion} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Questions</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconCourse} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Courses</span>
                    </li>
                    <li className="profileMenuItem">
                        <img src={IconMusic} alt="" className="ic-22 icons" />
                        <span className="profileMenuItem-option">Music</span>
                    </li>
                </ul>
                <div className="profileMenu-line"></div>
                <h3 className="profileMenu-Friends">My Friends</h3>
                <div className="profileMenu-FriendsList">
                    <CloseFriend />
                    <CloseFriend />
                    <CloseFriend />
                    <CloseFriend />
                </div>
            </div>
        </div>
    </>);
}

export default ProfileMenu;