import IconPlus from "../assets/images/icons/ic_plus.svg";
import Imgstr1 from "../assets/images/tmtu.png";
import Imgstr2 from "../assets/images/tcdoan.png";
import Imgstr3 from "../assets/images/luan.jpg";
import ImgPf1 from "../assets/images/tu.jpg";
import ImgPf2 from "../assets/images/tcdoan.png";
import ImgPf3 from "../assets/images/luan1.jpg";
import IconArrowRight from "../assets/images/icons/ic_arrow-right.svg";
import "../assets/css/right_bar.css";


const Stories = () => {
    return (<>
            <div className="right-sidebar">
                <div className="stories">
                    <div className="stories-header">
                        <h3>Stories</h3>
                    </div>
                    <div className="stories-body">
                        <div className="story-item create">
                            <div className="create-story">
                                <div className="ic-create-str">
                                    <img src={IconPlus} alt="create" className="ic-22"/>
                                </div>
                                <div className="document">
                                    Create story
                                </div>
                            </div>
                        </div>
                        <div className="story-item">
                            <img src={Imgstr1} alt="story-img" />
                            <div className="story-info">
                                <img src={ImgPf1} alt="taminhtu" />
                                <span>Tạ Minh Tú</span>
                            </div>
                        </div>
                        <div className="story-item">
                            <img src={Imgstr2} alt="story-img"/>
                            <div className="story-info">
                                <img src={ImgPf2} alt="trancongdoan"/>
                                <span>Trần Công Đoàn</span>
                            </div>
                        </div>
                        <div className="story-item">
                            <img src={Imgstr3} alt="story-img"/>
                            <div className="story-info">
                                <img src={ImgPf3} alt="thanhluan" />
                                <span>Nguyễn Thành Luân</span>
                            </div>
                        </div>
                        <div className="arrow-right">
                            <img src={IconArrowRight} alt="Next" className="ic-18"/>
                        </div>
                    </div>
                </div>
            </div>
    </>);

}

export default Stories;