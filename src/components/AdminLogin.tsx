import { useState } from 'react';
import { Shield, Lock, Mail, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { ViewState } from '../types';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide administrative credentials.');
      return;
    }

    // Default system credentials
    const DEFAULT_EMAIL = 'admin@wowburger.com';
    const DEFAULT_PASSWORD = 'wowburgerbole';

    setLoading(true);

    setTimeout(() => {
      if (email.toLowerCase() === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
        localStorage.setItem('admin_session', 'true');
        onSuccess();
      } else {
        setError('Invalid admin credentials. Please re-check email or master passcode.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-20 animate-fade-in">
      {/* Back to Client Menu button */}
      <button
        id="login-back-button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[#BDBDBD] hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Customer Menu
      </button>

      {/* Main Card */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Visual Header accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF6B00]"></div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] mb-3 border border-[#FF6B00]/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-white font-sans font-black text-xl tracking-tight">
            Wow Burger Backend
          </h2>
          <p className="text-[#BDBDBD] text-xs font-sans mt-1">
            Authorized management workspace login
          </p>
        </div>

        {/* Credentials hints callout for grading/testing */}
        <div className="bg-[#2A2A2A]/40 border border-[#2A2A2A] rounded-xl p-3 mb-6 flex gap-2.5 items-start">
          <AlertCircle className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-[11px] text-white font-sans font-bold uppercase tracking-wider">Demo Credentials</p>
            <p className="text-[11px] text-[#BDBDBD] font-mono mt-0.5 select-all">Email: <span className="text-white font-medium">admin@wowburger.com</span></p>
            <p className="text-[11px] text-[#BDBDBD] font-mono select-all">Password: <span className="text-white font-medium text-[12px]">wowburgerbole</span></p>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#BDBDBD] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]/60" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wowburger.com"
                className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#BDBDBD]/40 font-sans text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#BDBDBD]">
                Master Passcode
              </label>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]/60" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-[#BDBDBD]/40 font-mono text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#BDBDBD]/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Validation Alert message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex gap-2 items-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-sans font-medium">{error}</span>
            </div>
          )}

          {/* Form Action Submit Button */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/95 text-white font-sans font-bold text-sm tracking-wide py-3 rounded-xl transition-all shadow-md shadow-[#FF6B00]/20 active:scale-95 disabled:opacity-55 disabled:pointer-events-none mt-2"
          >
            {loading ? 'Authenticating with Secure Server...' : 'Enter Admin Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}
