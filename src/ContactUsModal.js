import React from 'react';
import './ContactUsModal.css'; // Import the CSS file

const ContactUsModal = ({ showModal, setShowModal }) => {
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Contact Us</h2>
                        <div className="contact-info">
                            <div className="contact-details">
                                <div className="contact-title">Khent Lloyd A. Cases</div>
                                <div className="contact-role">Frontend Developer/Backend Developer</div>
                                <p className="contact-email">Email: <a href="mailto:khentlloyd.cases@cit.edu">khentlloyd.cases@cit.edu</a></p>
                                <p className="contact-phone">Phone: <span>+639398840532</span></p>
                                <div className="social-icons">
                                    <a href="https://www.facebook.com/khentl.ac" target="_blank" rel="noopener noreferrer">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png" alt="Facebook" className="social-icon" />
                                    </a>
                                    <a href="https://www.instagram.com/khentlloyddx/" target="_blank" rel="noopener noreferrer">
                                        <img src="https://dreamfoundry.org/wp-content/uploads/2018/12/instagram-logo-png-transparent-background.png" alt="Instagram" className="social-icon" />
                                    </a>
                                </div>
                            </div>
                            <div className="contact-details">
                                <div className="contact-title">Keith Harvey P. Angel</div>
                                <div className="contact-role">Web Designer/Frontend Developer</div>
                                <p className="contact-email">Email: <a href="mailto:keithharvey.angel@cit.edu">keithharvey.angel@cit.edu</a></p>
                                <p className="contact-phone">Phone: <span>+639275767079</span></p>
                                <div className="social-icons">
                                    <a href="https://www.facebook.com/Eclipsseee" target="_blank" rel="noopener noreferrer">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png" alt="Facebook" className="social-icon" />
                                    </a>
                                    <a href="https://www.instagram.com/eclipse._.k/" target="_blank" rel="noopener noreferrer">
                                        <img src="https://dreamfoundry.org/wp-content/uploads/2018/12/instagram-logo-png-transparent-background.png" alt="Instagram" className="social-icon" />
                                    </a>
                                </div>
                            </div>
                            <div className="contact-details">
                                <div className="contact-title">Elaisha Mae M. Arias</div>
                                <div className="contact-role">UI/UX Designer</div>
                                <p className="contact-email">Email: <a href="mailto:elaishamae.arias@cit.edu">elaishamae.arias@cit.edu</a></p>
                                <p className="contact-phone">Phone: <span>+6390956765825</span></p>
                                <div className="social-icons">
                                    <a href="https://www.facebook.com/elaisha.arias" target="_blank" rel="noopener noreferrer">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png" alt="Facebook" className="social-icon" />
                                    </a>
                                    <a href="https://www.instagram.com/sxnzelsh/" target="_blank" rel="noopener noreferrer">
                                        <img src="https://dreamfoundry.org/wp-content/uploads/2018/12/instagram-logo-png-transparent-background.png" alt="Instagram" className="social-icon" />
                                    </a>
                                </div>
                            </div>
                            <div className="contact-details">
                                <div className="contact-title">Arbien M. Armenion</div>
                                <div className="contact-role">Tester/Data Manager</div>
                                <p className="contact-email">Email: <a href="mailto:arbien.armenion@cit.edu">arbien.armenion@cit.edu</a></p>
                                <p className="contact-phone">Phone: <span>+639702561633</span></p>
                                <div className="social-icons">
                                    <a href="https://www.facebook.com/arbien.armenion.77" target="_blank" rel="noopener noreferrer">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png" alt="Facebook" className="social-icon" />
                                    </a>
                                    <a href="https://www.instagram.com/neofelis_07/" target="_blank" rel="noopener noreferrer">
                                        <img src="https://dreamfoundry.org/wp-content/uploads/2018/12/instagram-logo-png-transparent-background.png" alt="Instagram" className="social-icon" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ContactUsModal;
