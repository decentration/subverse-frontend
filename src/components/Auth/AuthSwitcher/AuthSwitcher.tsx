
import React from 'react';
import clsx from 'clsx';

interface AuthSwitcherProps {
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
}

const AuthSwitcher: React.FC<AuthSwitcherProps> = ({ mode, setMode }) => {
  const isLoginMode = mode === 'login';
  const isSignupMode = mode === 'signup';

  return (
    <div className="flex">
      <button
        className={clsx(
          'py-2 px-4',
          isSignupMode ? 'text-white bg-blue-500' : 'text-blue-500 bg-white'
        )}
        onClick={() => setMode('signup')}
      >
        Sign Up
      </button>
      <button
        className={clsx(
          'py-2 px-4',
          isLoginMode ? 'text-white bg-blue-500' : 'text-blue-500 bg-white'
        )}
        onClick={() => setMode('login')}
      >
        Login
      </button>
    </div>
  );
};

export default AuthSwitcher;
