import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { User, Mail, Calendar, Key, Shield, Sparkles, BookOpen, Clock, Activity, Bookmark } from 'lucide-react';

const ProfilePage = () => {
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBorrows: 0,
    totalReads: 0,
    searches: 0
  });

  const currentUser = api.getCurrentUser();

  const fetchTimelineAndStats = async () => {
    try {
      if (currentUser) {
        setTimelineLoading(true);
        // Fetch MongoDB activity logs
        const logs = await api.getActivityHistory(currentUser.id);
        setTimeline(logs);

        // Calculate statistics dynamically
        const activeB = logs.filter(log => log.activityType === 'BORROW').length - 
                        logs.filter(log => log.activityType === 'RETURN').length;
        const totalR = logs.filter(log => log.activityType === 'BORROW').length;
        const searchQ = logs.filter(log => log.activityType === 'SEARCH').length;

        setStats({
          activeBorrows: Math.max(0, activeB),
          totalReads: totalR,
          searches: searchQ
        });
      }
    } catch (err) {
      console.warn("Failed to load user shelf timeline details: ", err);
    } finally {
      setTimelineLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineAndStats();
  }, []);

  // Determine a mock joined date for aesthetic purposes based on user id or name length
  const getJoinedDate = () => {
    if (!currentUser) return 'May 2026';
    const day = (currentUser.username.length * 3) % 28 + 1;
    return `May ${day}, 2026`;
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Header titles */}
      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-biscuit" />
        <h2 className="font-serif text-lg font-bold text-cream uppercase">Personal Library Shelf</h2>
      </div>

      {/* Main split grid panel: details vs activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile info & stats card */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* User Details card */}
          <div className="bg-[#181411] border border-coffee-850 p-6 rounded-2xl flex flex-col gap-6 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-biscuit/5 blur-[50px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-coffee-950 border border-coffee-800 rounded-2xl flex items-center justify-center shadow-inner text-[#c6a67a]">
                {currentUser?.role === 'ADMIN' ? (
                  <Shield className="h-8 w-8" />
                ) : (
                  <User className="h-8 w-8" />
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif text-base font-bold text-cream leading-tight">
                  {currentUser?.username || 'Library Guest'}
                </h3>
                <span className="text-[10px] text-biscuit font-mono uppercase font-bold tracking-widest mt-1">
                  {currentUser?.role || 'USER ROLE'}
                </span>
              </div>
            </div>

            {/* Visual fields list */}
            <div className="flex flex-col gap-4 border-t border-coffee-850/50 pt-5 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-coffee-700 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-coffee-700 uppercase font-bold">Email Address</span>
                  <span className="text-cream mt-0.5">{currentUser?.email || 'not_configured@antigravity.sys'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-coffee-700 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-coffee-700 uppercase font-bold">Member Joined</span>
                  <span className="text-cream mt-0.5">{getJoinedDate()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-coffee-700 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-coffee-700 uppercase font-bold">Account Index Hash</span>
                  <span className="text-cream font-mono text-[10px] mt-0.5 truncate max-w-[180px]">
                    {currentUser?.id ? `ID-NODE-${currentUser.id}` : 'SYS-ANONYMOUS'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* User shelf statistics */}
          <div className="bg-[#181411] border border-coffee-850 p-6 rounded-2xl flex flex-col gap-5 shadow-premium">
            <h4 className="font-serif text-xs font-bold text-cream uppercase tracking-wider">Reading Statistics</h4>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-coffee-950 border border-coffee-850 p-3.5 rounded-xl flex flex-col justify-center gap-1 shadow-inner">
                <Clock className="h-4 w-4 text-biscuit mx-auto" />
                <span className="text-lg font-extrabold text-cream leading-tight mt-1">{stats.activeBorrows}</span>
                <span className="text-[8px] font-mono text-coffee-700 uppercase font-bold tracking-wider">Active</span>
              </div>

              <div className="bg-coffee-950 border border-coffee-850 p-3.5 rounded-xl flex flex-col justify-center gap-1 shadow-inner">
                <BookOpen className="h-4 w-4 text-[#c6a67a] mx-auto" />
                <span className="text-lg font-extrabold text-cream leading-tight mt-1">{stats.totalReads}</span>
                <span className="text-[8px] font-mono text-coffee-700 uppercase font-bold tracking-wider">Total Read</span>
              </div>

              <div className="bg-coffee-950 border border-coffee-850 p-3.5 rounded-xl flex flex-col justify-center gap-1 shadow-inner">
                <Activity className="h-4 w-4 text-cream mx-auto" />
                <span className="text-lg font-extrabold text-cream leading-tight mt-1">{stats.searches}</span>
                <span className="text-[8px] font-mono text-coffee-700 uppercase font-bold tracking-wider">Searches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline of activities logged in MongoDB (takes 2 cols) */}
        <div className="lg:col-span-2 bg-[#181411] border border-coffee-850 p-6 lg:p-7 rounded-2xl flex flex-col gap-6 shadow-premium">
          <div className="flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-biscuit animate-pulse" />
            <h3 className="font-serif text-sm font-bold tracking-tight text-cream uppercase">Personal Reading Timeline</h3>
          </div>

          {timelineLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-coffee-950 border border-coffee-850 rounded-xl shimmer"></div>
              ))}
            </div>
          ) : timeline.length === 0 ? (
            <div className="text-center py-16 bg-coffee-950 border border-coffee-850 rounded-xl flex flex-col items-center justify-center gap-2">
              <Bookmark className="h-8 w-8 text-coffee-700" />
              <p className="text-beige text-xs font-semibold">Your activity timeline is currently vacant.</p>
              <p className="text-coffee-700 text-[10px]">Lend book volumes or conduct semantic searches to seed your registry.</p>
            </div>
          ) : (
            <div className="relative border-l border-coffee-850 pl-5.5 ml-3.5 flex flex-col gap-6.5">
              {timeline.map((item) => {
                const date = new Date(item.timestamp);
                let colorClass = 'bg-biscuit border-[#c6a67a]';
                let activityText = item.details;
                
                if (item.activityType === 'BORROW') {
                  colorClass = 'bg-[#c6a67a] border-[#c6a67a]/40 text-black';
                } else if (item.activityType === 'RETURN') {
                  colorClass = 'bg-green-500 border-green-500/40 text-black';
                } else if (item.activityType === 'SEARCH') {
                  colorClass = 'bg-[#e5d3b3] border-[#e5d3b3]/40 text-black';
                  activityText = `Searched conceptually: "${item.details}"`;
                }

                return (
                  <div key={item.id} className="relative flex flex-col gap-1 text-xs">
                    {/* Circle tag indicators */}
                    <div className={`absolute -left-[30px] top-0.5 h-4.5 w-4.5 rounded-full border-4 border-coffee-900 flex items-center justify-center ${colorClass}`}>
                      <span className="text-[7px] font-mono font-extrabold uppercase"></span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-coffee-700 font-mono font-semibold uppercase tracking-wider">
                      <span>{item.activityType} Activity Node</span>
                      <span>{date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <p className="text-cream text-xs font-medium leading-relaxed font-sans mt-0.5">
                      {activityText}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-coffee-850/40 pt-4 text-[9px] text-coffee-700 font-mono leading-relaxed">
            All user shelf transactions are persistently recorded using high-fidelity MongoDB collections.
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
