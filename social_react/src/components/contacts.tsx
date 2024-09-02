import ImgPf1 from "../assets/images/tu.jpg";
import ImgPf2 from "../assets/images/tcdoan.png";
import ImgPf3 from "../assets/images/luan1.jpg";
import "../assets/css/right_bar.css";


const Contacts = () => {
    return (<>
            <div className="right-sidebar">
                <div className="contacts">
                    <h3>Contacts</h3>
                    <ul>
                        <li><a href="#"><img src={ImgPf1} className="img-contact"/>Tạ Minh Tú</a></li>
                        <li><a href="#"><img src={ImgPf2} className="img-contact"/>Trần Công Đoàn</a></li>
                        <li><a href="#"><img src={ImgPf3} className="img-contact"/>Nguyễn Thành Luân</a></li>
                    </ul>
                </div>
            </div>  
    </>);

}

export default Contacts;