import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  User,
  Gem,
  AlertCircle
} from 'lucide-react';

const LoginPage = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!username.trim() || !password.trim()) {

      setError(
        'Please enter both username and password.'
      );

      return;
    }

    setLoading(true);
    setError('');

    try {

      await api.login(
        username.trim(),
        password.trim()
      );

      navigate('/dashboard');

    } catch (err) {

      setError(
        err.message ||
        'Invalid username or password.'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-coffee-950 flex items-center justify-center px-4 py-10 overflow-hidden relative">

      {/* Ambient Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-biscuit/5 blur-[140px] pointer-events-none"></div>

      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#3a2d22]/20 blur-[140px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#181411]/95 border border-coffee-850 p-8 rounded-3xl shadow-premium animate-fade-in flex flex-col gap-6 relative z-10 glass-panel">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">

          <div className="h-14 w-14 bg-biscuit/10 border border-biscuit/20 rounded-2xl flex items-center justify-center shadow-inner">

            <Gem className="h-7 w-7 text-biscuit" />
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-wide text-cream uppercase text-center">
            Digital Working Library
          </h1>

          <span className="text-[11px] text-[#c6a67a] font-mono tracking-[0.25em] uppercase text-center">
            DIGITAL LIBRARY SYSTEM
          </span>
        </div>

        {/* Error */}
        {error && (

          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold">

            <AlertCircle className="h-4 w-4 flex-shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5"
        >

          {/* Username */}
          <div className="flex flex-col gap-2">

            <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#c6a67a] uppercase">
              Username ID
            </label>

            <div className="relative">

              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-coffee-700 pointer-events-none" />

              <input
                type="text"
                required
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="w-full bg-coffee-950 border border-coffee-850 rounded-xl pl-14 pr-4 py-3.5 text-sm text-cream placeholder:text-coffee-700 focus:border-[#c6a67a] transition-all shadow-inner"
                placeholder="Enter username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">

            <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#c6a67a] uppercase">
              Security Password
            </label>

            <div className="relative">

              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-coffee-700 pointer-events-none" />

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-coffee-950 border border-coffee-850 rounded-xl pl-14 pr-4 py-3.5 text-sm text-cream placeholder:text-coffee-700 focus:border-[#c6a67a] transition-all shadow-inner"
                placeholder="Enter account password"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-biscuit hover:bg-[#b09164] text-black font-mono font-bold uppercase text-xs py-3.5 rounded-xl tracking-[0.2em] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer shadow-premium"
          >

            {loading
              ? 'Decrypting Token...'
              : 'Authenticate Access'}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-coffee-850/40 pt-5 flex items-center justify-between text-xs">

          <span className="text-coffee-700">
            No account credentials?
          </span>

          <button
            onClick={() =>
              navigate('/register')
            }
            className="text-biscuit hover:text-cream hover:underline font-bold transition-all cursor-pointer"
          >
            Create Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;