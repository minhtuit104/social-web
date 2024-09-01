import ImgTu from "../assets/images/tu.jpg";
import ImgLuan from "../assets/images/luan.jpg";
import IconSend from "../assets/images/icons/ic_send.svg";
import { Modal, Button } from "react-bootstrap";
import "../assets/css/modal_comment.css";


const ModalComment = (props: any) => {
    const {show, handleClose} = props;
    return (
        <>
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
            <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>2 comment</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '500px', overflowY: 'auto' }}>
                <div>
                    <div className="comment-parent">
                        <div className="comment-parent-header">
                            <img src={ImgTu} alt="Tu"/>
                            <div className="comment-info">
                                <h3>Tạ Minh Tú</h3>
                                <h5>1 minutes ago</h5>
                            </div>
                        </div>
                        <div className="comment-content">
                            <p>Great. Remember invite me in the next time. We'll travel around the world together. I hope we'll have the happy trip.</p>
                        </div>
                        <div className="comment-footer">
                            <span>Like</span>
                            <span>Reply</span>
                        </div>                
                    </div>

                    <div className="comment-child">
                        <div className="comment-child-header">
                            <img src={ImgLuan} alt="Luan"/>
                            <div className="comment-info">
                                <h3>Thành Luân</h3>
                                <h5>1 minutes ago</h5>
                            </div>
                        </div>
                        <div className="comment-content">
                            <p>I want to go alone to avoid my wife</p>                
                        </div>
                        <div className="comment-footer">
                            <span>Like</span>
                            <span>Reply</span>
                        </div>                
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>              
                    <img src={ImgTu} alt="Tu" className="modal-footer-image"/>
                    <div className="modal-footer-input">
                        <input type="text" className="input" placeholder="Comment as Tạ Minh Tú"/>
                        <button className="send-btn" onClick={handleClose}>
                          <img src={IconSend} className="ic-22" alt="Send"/>
                        </button>
                    </div>
            </Modal.Footer>
      </Modal>
        </>
    );
}

export default ModalComment;