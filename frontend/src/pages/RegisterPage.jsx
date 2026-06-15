import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, Gem, ShieldAlert, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.register(username.trim(), email.trim(), password.trim(), role);
      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-950 flex items-center justify-center p-4">
      {/* Background Light effects */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-biscuit/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brown/5 blur-[120px] pointer-events-none"></div>

      {/* Register container card */}
      <div className="w-full max-w-md bg-[#181411] border border-coffee-850 p-8.5 rounded-2xl shadow-premium animate-fade-in flex flex-col gap-6 relative z-10">
        
        {/* Branding header */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 bg-biscuit/10 border border-biscuit/20 rounded-xl flex items-center justify-center shadow-inner">
            <Gem className="h-6 w-6 text-biscuit" />
          </div>
          <h1 className="font-serif text-xl font-bold tracking-widest text-cream uppercase mt-2 leading-none">
            Digital Working Library
          </h1>
          <span className="text-[10px] text-[#c6a67a] font-mono tracking-widest uppercase mt-1 leading-none">
            CREATE SYSTEM CREDENTIALS
          </span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3.5 rounded-xl text-center text-xs font-bold font-mono">
            {success}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4.5">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
              Username ID
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-coffee-700" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-coffee-950 border border-coffee-850 rounded-xl pl-11.5 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors shadow-inner"
                placeholder="Choose username (e.g. librarian)"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-coffee-700" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-coffee-950 border border-coffee-850 rounded-xl pl-11.5 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors shadow-inner"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-coffee-700" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-coffee-950 border border-coffee-850 rounded-xl pl-11.5 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors shadow-inner"
                placeholder="Choose password"
              />
            </div>
          </div>

          {/* Role selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Account Permissions Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-coffee-950 border border-coffee-850 rounded-xl px-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors cursor-pointer shadow-inner"
            >
              <option value="USER" className="bg-[#181411] text-cream">USER (Standard Member access)</option>
              <option value="ADMIN" className="bg-[#181411] text-cream">ADMIN (Full catalogue curation privileges)</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-biscuit hover:bg-[#b09164] text-black font-mono font-bold uppercase text-xs py-3.5 rounded-xl tracking-widest transition-all duration-300 active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer shadow-premium"
          >
            {loading ? 'Registering Account...' : 'Register Credentials'}
          </button>
        </form>

        {/* Separator / Redirect */}
        <div className="border-t border-coffee-850/40 pt-5 flex items-center justify-between text-xs">
          <span className="text-coffee-700">Already registered?</span>
          <button
            onClick={() => navigate('/login')}
            className="text-biscuit hover:text-cream hover:underline font-bold transition-all cursor-pointer"
          >
            Sign In Here
          </button>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
