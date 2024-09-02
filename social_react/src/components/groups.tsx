import ImgGroup from "../assets/images/Group.jpg";
import IconPlus from "../assets/images/icons/ic_plus.svg";
import "../assets/css/right_bar.css";



const Groups = () => {
    return (<>
            <div className="right-sidebar">

                <div className="groups">
                    <h3>Group conversations</h3>
                    <div className="group">
                        <ul>
                            <li><a href="#"><img src={ImgGroup} className="img-contact"/>Food Tour Đồi Rồng</a></li>
                            <li><a href="#"><div className="ic-plus"><img src={IconPlus} /></div> Create new group</a></li>
                        </ul>
                    </div>                
                </div>

            </div>
    </>);

}

export default Groups;