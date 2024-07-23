import React from 'react';
import './PrivacyPolicyModal.css'; // Import the CSS file

const PrivacyPolicyModal = ({ showModal, setShowModal }) => {
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className="modal privacy-policy-modal" data-cy="privacy-policy-modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
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
                    </div>
                </div>
            )}
        </>
    );
};

export default PrivacyPolicyModal;
