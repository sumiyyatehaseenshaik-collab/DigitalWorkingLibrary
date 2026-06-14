import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BookOpen, Users, Clock, History, Compass, Search, Sparkles, BookMarked, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = api.getCurrentUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-[#181411] border border-coffee-850 rounded-2xl shimmer"></div>
          ))}
        </div>
        <div className="h-80 bg-[#181411] border border-coffee-850 rounded-2xl shimmer"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-[#181411] border border-coffee-850 p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-biscuit/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2 text-biscuit font-mono text-[10px] font-bold uppercase tracking-widest">
            <Landmark className="h-4 w-4" />
            <span>AUTHENTICATED SECURE NODE</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-cream tracking-tight mt-1">
            Welcome Back, {user?.username || 'Librarian'}
          </h2>
          <p className="text-xs text-coffee-700 leading-relaxed">
            Welcome to the Antigravity Digital Library. Browse our high-end, conceptual catalog of design, software engineering, databases, and artificial intelligence textbooks. Enjoy clean vector searches.
          </p>
        </div>
        <button
          onClick={() => navigate('/books')}
          className="bg-biscuit hover:bg-[#b09164] text-black font-mono font-bold uppercase text-xs px-5 py-3 rounded-xl tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center gap-2 shadow-premium"
        >
          <BookOpen className="h-4 w-4" />
          <span>Browse Catalogue</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4.5 rounded-xl text-center text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Dynamic Statistics Grids */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Books */}
          <div className="bg-[#181411] border border-coffee-850 p-5 rounded-2xl flex items-center justify-between shadow-premium hover:border-[#c6a67a] transition-all">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono tracking-widest text-[#c6a67a] uppercase font-bold">Catalogued Titles</span>
              <span className="text-2xl font-extrabold tracking-tight text-cream">{stats.totalBooks}</span>
            </div>
            <div className="h-10 w-10 bg-coffee-950 border border-coffee-850 rounded-xl flex items-center justify-center shadow-inner">
              <BookMarked className="h-5 w-5 text-biscuit" />
            </div>
          </div>

          {/* Active Borrow Records */}
          <div className="bg-[#181411] border border-coffee-850 p-5 rounded-2xl flex items-center justify-between shadow-premium hover:border-[#c6a67a] transition-all">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono tracking-widest text-[#c6a67a] uppercase font-bold">Active Borrows</span>
              <span className="text-2xl font-extrabold tracking-tight text-cream">{stats.activeBorrows}</span>
            </div>
            <div className="h-10 w-10 bg-coffee-950 border border-coffee-850 rounded-xl flex items-center justify-center shadow-inner">
              <Clock className="h-5 w-5 text-biscuit" />
            </div>
          </div>

          {/* Historic borrow checkouts */}
          <div className="bg-[#181411] border border-coffee-850 p-5 rounded-2xl flex items-center justify-between shadow-premium hover:border-[#c6a67a] transition-all">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono tracking-widest text-[#c6a67a] uppercase font-bold">Historic Checkouts</span>
              <span className="text-2xl font-extrabold tracking-tight text-cream">{stats.borrowedBooks}</span>
            </div>
            <div className="h-10 w-10 bg-coffee-950 border border-coffee-850 rounded-xl flex items-center justify-center shadow-inner">
              <History className="h-5 w-5 text-biscuit" />
            </div>
          </div>

          {/* Registered Users */}
          <div className="bg-[#181411] border border-coffee-850 p-5 rounded-2xl flex items-center justify-between shadow-premium hover:border-[#c6a67a] transition-all">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono tracking-widest text-[#c6a67a] uppercase font-bold">System Users</span>
              <span className="text-2xl font-extrabold tracking-tight text-cream">{stats.users}</span>
            </div>
            <div className="h-10 w-10 bg-coffee-950 border border-coffee-850 rounded-xl flex items-center justify-center shadow-inner">
              <Users className="h-5 w-5 text-biscuit" />
            </div>
          </div>
        </div>
      )}

      {/* Elegant Library Layout grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core AI prompt showcase panel */}
        <div className="lg:col-span-2 bg-[#181411] border border-coffee-850 p-6.5 rounded-2xl flex flex-col gap-5 shadow-premium">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-biscuit animate-pulse" />
            <h3 className="font-serif text-sm font-bold tracking-tight text-cream uppercase">AI Cognitive Vector Core</h3>
          </div>
          
          <div className="bg-coffee-950 border border-coffee-850 p-5 rounded-xl flex flex-col gap-3">
            <p className="text-[11px] text-beige leading-relaxed">
              Our advanced MongoDB semantic search indexes utilize high-dimensional vector representations computed from textual summaries. Experience conceptual search by typing conceptual queries!
            </p>
            <span className="text-[9px] font-mono text-coffee-700 tracking-wider">SUPPORTED QUERIES: "startup strategy", "database architectures", "ui/ux design principles", "artificial intelligence"</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/search')}
              className="flex-1 py-3 bg-coffee-950 hover:bg-coffee-900 border border-coffee-850 text-biscuit rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-inner"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Launch Vector Search</span>
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 py-3 bg-coffee-950 hover:bg-coffee-900 border border-coffee-850 text-cream rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-inner"
            >
              <History className="h-3.5 w-3.5" />
              <span>Review Reading Timeline</span>
            </button>
          </div>
        </div>

        {/* Library Info Card */}
        <div className="bg-[#181411] border border-coffee-850 p-6.5 rounded-2xl flex flex-col gap-4 shadow-premium">
          <div className="flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-biscuit" />
            <h3 className="font-serif text-sm font-bold tracking-tight text-cream uppercase">Library Status</h3>
          </div>
          
          <div className="divide-y divide-coffee-850/40 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-beige">PostgreSQL Node</span>
              <span className="font-mono text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">CONNECTED</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-beige">MongoDB Server</span>
              <span className="font-mono text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">CONNECTED</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-beige">API Gateway Core</span>
              <span className="font-mono text-[10px] text-biscuit font-bold bg-biscuit/10 px-2 py-0.5 rounded border border-biscuit/20">PORT 8080</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-beige">Library Hours</span>
              <span className="font-mono text-[10px] text-cream">24/7 Digital Grid</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
