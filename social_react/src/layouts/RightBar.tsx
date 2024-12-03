import ChatWindows from "../components/chatWindow/chatWindows";
import Contacts from "../components/contacts";
import Groups from "../components/groups";
import Stories from "../components/stories";


const RightBar = ({socket}: {socket: any}) => {
    return (<>
        <div className="nav-stories">
            <Stories />
            <Contacts socket={socket}/>
            <Groups />  
            <ChatWindows socket={socket} />
        </div>
    </>);
}

export default RightBar;