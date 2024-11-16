import "../assets/css/feed_page.css";
import ContentHeader from "../components/content_header";
import PostInput from "../components/content_post_input";
import Posts from "../components/content_posts";

const FeedPage = () => {

    return (<>
        <div className="content" id="scrollableDiv">
            <div className="content-container">
                <ContentHeader />
                <PostInput />
                <Posts />   
            </div>
        </div>
    </>);
}

export default FeedPage;