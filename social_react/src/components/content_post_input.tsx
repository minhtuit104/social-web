import IconGlobal from "../assets/images/icons/ic_global.svg";
import IconArrdow from "../assets/images/icons/ic_arrorw-dow.svg";
import IconLibrary from "../assets/images/icons/ic_library.svg";
import ImgTu from "../assets/images/tu.jpg";
import "../assets/css/content_post_input.css";
import ModalInputPost from "./modal_post_input";
import { useEffect, useState } from "react";
import { fectchUserName } from "../services/UserService";


const PostInput = () => {

    const [avarta, setAvarta] = useState<string | null>(null);

    //hàm giải mã token
    const getUserFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split('')
              .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          );
          return JSON.parse(jsonPayload);
        }
        return null;
      };

    const user = getUserFromToken();
    const idUser = user?.idUser;
    useEffect(() => {
    const getUser = async () =>{
        if(idUser){
            try {
                const userData = await fectchUserName(idUser);
                if(userData){
                setAvarta(userData.avarta);
            }
            } catch (error) {
                console.error('Failed to fetch user name:', error);
            }
        }
    };
    getUser();
    },[idUser])

    const [isShowModalInputPost, setIsShowModalInputPost] = useState(false)
    const handleClose = () =>{
        setIsShowModalInputPost(false);
    }

    return(<>
    <div className="main-content">
        <div className="post-input">
            <div className="post-input-top">
                <img src={avarta ?? 'https://www.gravatar.com/avatar/?d=mp' } alt="Profile Image" className="post-profile-image"/>
                {/* <input type="text" placeholder="What's on your mind?"/> */}
                <button onClick={() => setIsShowModalInputPost(true)}>What's on your mind?</button>
            </div>
            <div className="post-actions">
                <div className="privacy-down">
                    <button className="publish-btn">
                        <img src={IconGlobal} alt="Global" className="ic-18"/>Publish<img src={IconArrdow} alt="Arrow Down"  className="list"/>
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