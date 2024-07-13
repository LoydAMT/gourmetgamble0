import React from 'react';
import './AboutUsModal.css'; // Import the CSS file
import khentPhoto from './MemberPhotos/Khent.jpg';
import elaishaPhoto from './MemberPhotos/Elaisha.jpg';
import arbienPhoto from './MemberPhotos/Arbien.jpg';
import keithPhoto from './MemberPhotos/Keith.jpg';

const AboutUsModal = ({ showModal, setShowModal }) => {
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>About Us</h2>
                        <p>Welcome to our Parlay community! We are dedicated to bringing together food enthusiasts 
                        from all walks of life. Our mission is to create a platform where you can share, discover, 
                        and enjoy recipes from around the world, encouraging exploration and gambling on big gourmet victories.</p>
                        
                        <h3>Our Story</h3>
                        <p>Founded in 2024, our platform was born out of a passion for cooking and 
                        the desire to make it easier for people to find and share recipes. We believe that 
                        food has the power to bring people together, and we wanted to create a space where 
                        that could happen.</p>
                        
                        <h3>Our Team</h3>
                        <p>We are a diverse group of food lovers, tech enthusiasts, and community builders. 
                        Our team is committed to providing you with the best user experience possible. We 
                        work hard to ensure that our platform is user-friendly, reliable, and fun to use.</p>
                        <div className="MemberPhotos">
                            <div className="MemberPhoto">
                                <img src={khentPhoto} alt="Khent" />
                                <a href="https://www.instagram.com/khentlloyddx/" target="_blank" rel="noopener noreferrer">
                                    <h4>Khent Lloyd</h4>
                                </a>
                            </div>
                            <div className="MemberPhoto">
                                <img src={elaishaPhoto} alt="Elaisha" />
                                <a href="https://www.instagram.com/sxnzelsh/" target="_blank" rel="noopener noreferrer">
                                    <h4>Elaisha Mae</h4>
                                </a>
                            </div>
                            <div className="MemberPhoto">
                                <img src={arbienPhoto} alt="Arbien" />
                                <a href="https://www.instagram.com/neofelis_07/" target="_blank" rel="noopener noreferrer">
                                    <h4>Arbien (John)</h4>
                                </a>
                            </div>
                            <div className="MemberPhoto">
                                <img src={keithPhoto} alt="Keith" />
                                <a href="https://www.instagram.com/eclipse._.k/" target="_blank" rel="noopener noreferrer">
                                    <h4>Keith Harvey</h4>
                                </a>
                            </div>
                        </div>

                        <h3>Join Us</h3>
                        <p>We invite you to join our community and start sharing your favorite recipes. 
                        Whether you are a seasoned chef or just starting out, there is a place for you here. 
                        Connect with other food enthusiasts, explore new cuisines, and enhance your cooking skills.</p>
                        
                        <h3>Contact Us</h3>
                        <p>If you have any questions, feedback, or suggestions, we would love to hear from you. Feel free to reach out to us at Parlay@gmail.com.</p>

                        <p>Thank you for being a part of our Parlay community. Happy cooking!</p>

                    </div>
                </div>
            )}
        </>
    );
};

export default AboutUsModal;
