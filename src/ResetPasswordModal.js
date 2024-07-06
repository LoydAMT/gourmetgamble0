import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';
import './ResetPasswordModal.css'; // Import the CSS file

const ResetPasswordModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
      setError('');
    } catch (error) {
      setMessage('');
      setError(error.message);
    }
  };

  if (!show) return null;

  return (
    <div className="reset-password-modal">
      <div className="reset-password-modal-content">
        <div className="reset-password-modal-header">
          <h2>Reset Password</h2>
          <span className="close" onClick={handleClose}>&times;</span>
        </div>
        <div className="reset-password-modal-body">
          <form>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="button" onClick={handlePasswordReset} className="reset-button">
              Reset Password
            </button>
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
          </form>
        </div>
        <div className="reset-password-modal-footer">
          <button onClick={handleClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
