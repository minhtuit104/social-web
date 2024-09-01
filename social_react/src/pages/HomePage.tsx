import NavBar from "../layouts/NavBar";
import RightBar from "../layouts/RightBar";
import FeedPage from "./FeedPage";
import "../assets/css/home_page.css";

const HomePage = () => {
    return (<>
        <div className="homepage">
                <NavBar />           
                <FeedPage />        
                <RightBar />           
        </div>
    </>);
}

export default HomePage;