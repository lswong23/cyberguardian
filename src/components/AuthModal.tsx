import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created successfully! You can now sign in.');
          // Clear form
          setEmail('');
          setPassword('');
          setDisplayName('');
          // Switch to sign in mode
          setTimeout(() => {
            onModeChange('signin');
            setSuccess(null);
          }, 2000);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError(null);
    setSuccess(null);
  };

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    resetForm();
    onModeChange(newMode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-warm border-4 border-navy">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-elderly-2xl font-bold text-navy">
            {mode === 'signin' ? 'Welcome Back!' : 'Join Cyber Guardian'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label htmlFor="displayName" className="block text-elderly-lg font-semibold text-navy mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-elderly-lg focus:border-blue-accent focus:outline-none transition-colors duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-elderly-lg font-semibold text-navy mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-elderly-lg focus:border-blue-accent focus:outline-none transition-colors duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-elderly-lg font-semibold text-navy mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-elderly-lg focus:border-blue-accent focus:outline-none transition-colors duration-200"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            {mode === 'signup' && (
              <p className="text-elderly-base text-gray-600 mt-2">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <p className="text-elderly-lg text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <p className="text-elderly-lg text-green-700">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-accent text-warm-white py-4 rounded-xl text-elderly-xl font-bold hover:bg-blue-600 transition-colors duration-200 shadow-warm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-elderly-lg text-gray-600">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => handleModeChange(mode === 'signin' ? 'signup' : 'signin')}
            className="text-blue-accent font-semibold text-elderly-lg hover:underline mt-2"
          >
            {mode === 'signin' ? 'Create one here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;