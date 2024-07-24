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
                        <p>Effective Date: July 24, 2024 <br />
                            <br /><b>Introduction </b><br /> <br />
                            Welcome to Gourmet Gamble! We are a team of students from Cebu Institute of Technology University, 
                            currently located in Cebu City, Philippines. As part of our MSAD (Modern Systems Analysis and Design) / CPE340 class, 
                            we have created this website to explore React, Firebase, and web development. This Privacy Policy outlines how we collect, 
                            use, and protect your personal information when you interact with our website. By using our website, you agree to the terms 
                            of this Privacy Policy.
                            <br />
                            <br /><b>Information Collection</b> <br /> <br />
                            <ol>
                                <li><b>Personal Information During Registration: </b>We collect the following personal information when you register on our website:</li>
                                <dd>• Email address</dd>
                                <dd>• Password</dd>
                                <dd>• Name</dd>
                                <dd>• Culinary experience</dd>
                                <br />
                                <br />
                                <li><b>Recipe Uploads: </b>When you upload a recipe, we collect the following details:</li>
                                <dd>• Name of the dish</dd>
                                <dd>• Origin of the dish</dd>
                                <dd>• Name of the user</dd>
                                <dd>• Photo of the dish</dd>
                                <dd>• Video related to the recipe</dd>
                                <dd>• Recipe details</dd>
                                <dd>• Recipe steps</dd>
                                <dd>• Selected ingredients</dd>
                                <br />
                                <br />
                                <li><b>Usage Information: </b>We do not collect browsing behavior, IP addresses, or device information. However, please note that Firebase and Vercel may track data and traffic on our website.</li>
                                <br />
                            </ol>
                            <b>Information Usage</b>
                            <br />
                            <br />
                            We use the information we collect to:
                            <dd>• Enable user login and authentication</dd>
                            <dd>• Personalize user experiences</dd>
                            <dd>• Improve our services</dd>
                            <dd>• Provide reference for future changes</dd>
                            <br />
                            <br />
                            <b>Data Sharing and Security</b>
                            <br />
                            <br />
                            <ol>
                                <li><b>Data Sharing: </b>We do not share the collected personal information with any third parties.</li>
                                <br />
                                <li><b>Data Security: </b>We ensure the security of the collected data by using the data protection systems implemented by Firestore.</li>
                                <br />
                            </ol>
                            <b>User Rights and Choices</b>
                            <br />
                            <br />
                            <ol>
                                <li><b>Updating Personal Information: </b>Users have the ability to update their personal information. If users wish to delete their data, they can contact us via the provided email addresses or social media links available on the Contact Us tab.</li>
                                <br />
                                <li><b>Contacting Us: </b>If you have any questions or concerns about your privacy, please visit the Contact Us tab where our social media links, email addresses, and phone numbers are provided.</li>
                                <br />
                            </ol>
                            <b>Cookies and Tracking Technologies</b>
                            <br />
                            <br />
                            We use cookies to store data and enhance the user experience on our website. We do not use tracking technologies.
                            <br />
                            <br />
                            <b>Conclusion</b>
                            <br />
                            <br />
                            Thank you for using Gourmet Gamble. We are committed to protecting your privacy and ensuring a safe user experience. If you have any questions or need further assistance, please feel free to reach out to us through the Contact Us tab.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default PrivacyPolicyModal;
