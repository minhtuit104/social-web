import IconSearch from "../assets/images/icons/ic_search.svg";
import "../assets/css/content_header.css";


const ContentHeader = () => {
    return(<>
    <div className="main-content">
        <div className="nav-content-top">
                <div className="nav-bar feeds">Feeds</div>
                <div className="nav-bar search-btn">
                    <img src={IconSearch} alt="" className="ic-22" />
                    <span className="sp-popular">Popular</span>
                    <span className="sp-friends">Friends</span>
                </div>
        </div>
    </div>
    </>);
}

export default ContentHeader;