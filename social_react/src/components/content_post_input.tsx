import IconGlobal from "../assets/images/icons/ic_global.svg";
import IconArrdow from "../assets/images/icons/ic_arrorw-dow.svg";
import IconFriends from "../assets/images/icons/ic_friends.svg";
import IconLibrary from "../assets/images/icons/ic_library.svg";
import ImgTu from "../assets/images/tu.jpg";
import "../assets/css/content_post_input.css";


const PostInput = () => {
    return(<>
    <div className="main-content">
        <div className="post-input">
            <div className="post-input-top">
                <img src={ImgTu} alt="Profile Image" className="post-profile-image"/>
                <input type="text" placeholder="What's on your mind?"/>
            </div>
            <div className="post-actions">
                <div className="privacy-down">
                    <button className="publish-btn">
                        <img src={IconGlobal} className="ic-18"/>Publish<img src={IconArrdow} className="list"/>
                    </button>
                    <div className="friends-btn">
                        <button ><img src={IconGlobal} className="ic-18"/>Publish</button>
                        <button ><img src={IconFriends} className="ic-18"/>Friends</button>
                    </div>
                </div>
                    <button><img src={IconLibrary} className="ic-18"/>Image</button>
            </div>
        </div>
    </div>
    </>);
}

export default PostInput;