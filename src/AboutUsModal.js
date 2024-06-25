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

const AboutUsModal = ({ showModal, setShowModal }) => {
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div style={styles.modal} onClick={closeModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <span style={styles.close} onClick={closeModal}>&times;</span>
                        <h2>About Us</h2>
                        <p> HEHE ABOUT US
                        </p>
                        {/* Add more privacy policy content as needed */}
                    </div>
                </div>
            )}
        </>
    );
};

export default AboutUsModal;
