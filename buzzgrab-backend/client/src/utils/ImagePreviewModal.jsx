import { Modal } from 'react-bootstrap';

const ImagePreviewModal = ({ show, imageUrl, handleClose }) => {

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            className="review-video-modal"
            backdrop="static"
        >
            <Modal.Header closeButton className="border-0 p-2" />
            <Modal.Body className="text-center bg-transparent p-0">
                <img
                    src={imageUrl || "/images/default.png"}
                    alt="preview"
                    style={{
                        width: "100%",
                        maxHeight: "60vh",
                        objectFit: "cover",
                        borderRadius: "10px",
                        backgroundColor:  "transparent",
                        border: "none",
                    }}
                    crossOrigin="anonymous"
                />
            </Modal.Body>
        </Modal>
    );
};

export default ImagePreviewModal;

