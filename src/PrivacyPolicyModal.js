import React, { useState } from 'react';

const styles = {
    modal: {
        display: 'block', 
        position: 'fixed', 
        zIndex: 1, 
        left: 0,
        top: 0,
        width: '100%', 
        height: '100%', 
        overflow: 'auto', 
        backgroundColor: 'rgb(0,0,0)', 
        backgroundColor: 'rgba(0,0,0,0.4)', 
    },
    modalContent: {
        backgroundColor: '#fefefe',
        margin: '15% auto', 
        padding: '20px',
        border: '1px solid #888',
        width: '80%', 
        borderRadius: '10px',
    },
    close: {
        color: '#aaa',
        float: 'right',
        fontSize: '28px',
        fontWeight: 'bold',
        cursor: 'pointer',
    }
};

const PrivacyPolicyModal = ({ showModal, setShowModal }) => {
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div style={styles.modal} onClick={closeModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <span style={styles.close} onClick={closeModal}>&times;</span>
                        <h2>Privacy Policy</h2>
                        <p>Effective Date: June 26, 2024 <br />
                            <br /><b>Introduction </b><br /> <br />
                            We are committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, 
                            and sharing of information when you use our food recipe uploading platform, including video tutorials, photo tutorials, 
                            and other cooking-related content.
                            <br />
                            <br />Information We Collect <br /> <br />
                            <ol>
                                <li><b>Personal Information: </b>We collect personal information that you provide directly to us, such as:</li>
                                <dd>• Name</dd>
                                <dd>• Email address</dd>
                                <dd>• Profile picture</dd>
                                <dd>• Contact information</dd>
                                <br />
                                <br />
                                <li><b>Content Information: </b>When you upload recipes, photos, or videos, we collect:</li>
                                <dd>• Recipe details (ingredients, instructions, etc.)</dd>
                                <dd>• Photos and videos of your cooking process</dd>
                                <dd>• Comments and reviews on your content</dd>
                                <br />
                                <br />
                                <li><b>Usage Information: </b>We collect information about how you use our platform, including:</li>
                                <dd>• IP address</dd>
                                <dd>• Browser type</dd>
                                <dd>• Device information</dd>
                                <dd>• Pages visited</dd>
                                <dd>• Time spent on the site</dd>
                                <br />
                                <br />
                                <li><b>Cookies and Tracking Technologies: </b>We use cookies and similar technologies to collect data about your 
                                    browsing activities over time and across different websites or online services.
                                </li>
                                <br />
                                    <b>How We Use Information</b>
                                    <br />
                                    <br />
                                    We use the information we collect to:
                                    <dd>• Provide, operate, and maintain our services</dd>
                                    <dd>• Improve, personalize, and expand our services</dd>
                                    <dd>• Understand and analyze how you use our services</dd>
                                    <dd>• Develop new products, services, features,</dd>
                            </ol>
                            

                            </p>
                        {/* Add more privacy policy content as needed */}
                    </div>
                </div>
            )}
        </>
    );
};

export default PrivacyPolicyModal;
