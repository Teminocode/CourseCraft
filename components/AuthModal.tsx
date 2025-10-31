
import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In or Create Account">
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800">Welcome to CourseCraft!</h3>
        <p className="mt-2 text-gray-600">
          This is where a full authentication form (email/password, social logins) would be implemented.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button>Sign In</Button>
          <Button variant="secondary">Create Account</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
