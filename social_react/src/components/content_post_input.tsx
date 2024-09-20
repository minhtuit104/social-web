import IconGlobal from "../assets/images/icons/ic_global.svg";
import IconArrdow from "../assets/images/icons/ic_arrorw-dow.svg";
import IconFriends from "../assets/images/icons/ic_friends.svg";
import IconLibrary from "../assets/images/icons/ic_library.svg";
import ImgTu from "../assets/images/tu.jpg";
import "../assets/css/content_post_input.css";
import ModalInputPost from "./modal_post_input";
import { useEffect, useState } from "react";


const PostInput = () => {


    const [isShowModalInputPost, setIsShowModalInputPost] = useState(false)
    const handleClose = () =>{
        setIsShowModalInputPost(false);
    }

    return(<>
    <div className="main-content">
        <div className="post-input">
            <div className="post-input-top">
                <img src={ImgTu} alt="Profile Image" className="post-profile-image"/>
                {/* <input type="text" placeholder="What's on your mind?"/> */}
                <button onClick={() => setIsShowModalInputPost(true)}>What's on your mind?</button>
            </div>
            <div className="post-actions">
                <div className="privacy-down">
                    <button className="publish-btn">
                        <img src={IconGlobal} className="ic-18"/>Publish<img src={IconArrdow} className="list"/>
                    </button>
                </div>
                    <button onClick={() => setIsShowModalInputPost(true)}><img src={IconLibrary} className="ic-18"/>Image</button>
            </div>
        </div>
    </div>
    <ModalInputPost
    show = {isShowModalInputPost}
    handleClose = {handleClose} />
    </>);
}

export default PostInput;