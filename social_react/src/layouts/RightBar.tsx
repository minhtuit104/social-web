import Contacts from "../components/contacts";
import Groups from "../components/groups";
import Stories from "../components/stories";


const RightBar = () => {
    return (<>
        <div className="nav-stories">
            <Stories />
            <Contacts />
            <Groups />  
        </div>
    </>);
}

export default RightBar;