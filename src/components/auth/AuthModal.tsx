
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'login', onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const handleClose = () => {
    setMode('login');
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-transparent border-none p-0">
        {mode === 'login' ? (
          <LoginForm
            onSwitchToRegister={() => setMode('register')}
            onClose={handleSuccess}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setMode('login')}
            onClose={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

