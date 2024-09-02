import ImgProfile from "../assets/images/tu.jpg";
import IconGlobal from "../assets/images/icons/ic_global.svg";
import IconThreedot from "../assets/images/icons/ic_three-dot.svg";
import IconBookmark from "../assets/images/icons/ic_bookmark.svg";
import IconHide from "../assets/images/icons/ic_hide.svg";
import IconReport from "../assets/images/icons/ic_report.svg";
import IconLike from "../assets/images/icons/ic_like-fillsvg.svg";
import IconLove from "../assets/images/icons/ic_love.svg";
import IconHaha from "../assets/images/icons/ic_haha.svg";
import IconWow from "../assets/images/icons/ic_wow.svg";
import IconSad from "../assets/images/icons/ic_sad.svg";
import IconAngry from "../assets/images/icons/ic_angry.svg";
import IconCmt from "../assets/images/icons/ic_comment.svg";
import IconShare from "../assets/images/icons/ic_share.svg";
import Img1 from "../assets/images/anh1.jpg";
import Img2 from "../assets/images/anh2.jpeg";
import Img3 from "../assets/images/anh3.jpeg";
import Img4 from "../assets/images/anh4.jpg";
import "../assets/css/content_posts.css";
import { useEffect, useRef, useState } from "react";
import ModalComment from "./modal_comment";


const Posts = () => {

    const [isMenuContent, setIsMenuContent] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleShowMenu = () =>{
        setIsMenuContent(!isMenuContent);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuContent(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [isShowModalCmt, setIsShowModalCmt] = useState(false)
    const handleClose = () =>{
        setIsShowModalCmt(false);
    }

    return(<>
    <div className="main-content">
        <div className="posts">
                <div className="post">
                    <div className="post-header">
                        <div className="nav-post">
                            <img src={ImgProfile} alt="Profile Image" className="post-profile-image"/>
                            <div className="post-info">
                                <h3>Tạ Minh Tú</h3>
                                <p>2 minutes ago<img src={IconGlobal} className="ic-18 time-privacy"/></p>
                            </div>
                        </div>
                        
                        <div className="menu-items">
                            <button className="three-dot-btn" onClick={handleShowMenu}>
                                <img src={IconThreedot} alt="Menu" className="ic-22" />
                            </button>
                            <div ref={menuRef} className={`menu-content ${isMenuContent ? 'showmenu' : ''}`}>
                                <button className="menu-post-btn">
                                    <img src={IconBookmark} alt="" className="ic-18"/>
                                    <div className="options">
                                        <div>Save</div>
                                        <p>Add this to your saved items.</p>
                                    </div>
                                </button>
                                <button className="menu-post-btn">
                                    <img src={IconHide} alt="" className="ic-18"/>
                                    <div className="options">
                                        <div>Hide</div>
                                        <p>Hide this from your news feed.</p>
                                    </div>
                                </button>
                                <button className="menu-post-btn">
                                    <img src={IconReport} alt="" className="ic-18" />
                                    <div className="options">
                                        <div>Report</div>
                                        <p>We won't let user know who reported this.</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p>This is the most beautiful place I've ever been. I wish I would come back here to be able to discover more interesting things.</p>
                    <div className="post-images">
                        <img src={Img1} alt="Post Image" className="image"/>
                        <img src={Img2} alt="Post Image" className="image"/>
                        <img src={Img3} alt="Post Image" className="image"/>                        
                        <img src={Img4} alt="Post Image" className="image"/>                        
                        <img src={Img4} alt="Post Image" className="image"/>                        
                    </div>
                    <div className="post-footer">
                        <div className="like-comment">
                            <div className="main-reaction">
                                <img src={IconLike} className="ic-like-comment" id="mainReaction"/>
                                <span className="feelingCount">100</span>
                                <div className="feeling-options" id="feelingOptions">
                                    <img src={IconLike} alt="Like" className="feeling-icon" data-reaction="like-fillsvg"/>
                                    <img src={IconLove} alt="Love" className="feeling-icon" data-reaction="love"/>
                                    <img src={IconHaha} alt="Haha" className="feeling-icon" data-reaction="haha"/>
                                    <img src={IconWow} alt="Wow" className="feeling-icon" data-reaction="wow"/>
                                    <img src={IconSad} alt="Sad" className="feeling-icon" data-reaction="sad"/>
                                    <img src={IconAngry} alt="Angry" className="feeling-icon" data-reaction="angry"/>
                                </div>
                            </div>
                            <button className="comment-btn" onClick={() => setIsShowModalCmt(true)}><img src={IconCmt} alt="comment" className="ic-like-comment"/></button>
                            <span>18</span>
                        </div>
                        <div className="share">
                            <img src={IconShare} alt="" className="ic-share"/>
                        </div>
                    </div>
                </div>
                
        </div>
    </div>
    <ModalComment 
    show = {isShowModalCmt}
    handleClose = {handleClose}
    />
    </>);
}

export default Posts;