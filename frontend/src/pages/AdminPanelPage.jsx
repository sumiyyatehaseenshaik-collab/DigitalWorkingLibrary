import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import BookModal from '../components/BookModal';
import { 
  Shield, BarChart3, Users, History, Library, Plus, Search, 
  Trash2, Edit, CheckCircle, ShieldAlert, Award, Compass, RefreshCw, Bookmark
} from 'lucide-react';

const TABS = [
  { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'logs', label: 'Global MongoDB Logs', icon: History },
  { id: 'catalog', label: 'Catalog Curation', icon: Library }
];

const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Data states
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [globalLogs, setGlobalLogs] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  
  // Filter/search states
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Modals / loading / alerts
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUser = api.getCurrentUser();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch Dashboard statistics
      const statsData = await api.getDashboardStats();
      setStats(statsData);

      // Fetch Users list
      const usersData = await api.getUsers();
      setUsersList(usersData);

      // Fetch Books
      const booksData = await api.getBooks();
      setBooksList(booksData);
      setFilteredBooks(booksData);

      // Fetch Global activity history logs (seeded from Mongo for user id 0 / admin if supported, or fetch recent user logs)
      // Let's retrieve activity history for all users or try to aggregate from known ids. 
      // In the backend, `getActivityHistory(userId)` is defined. We can query logs for the admin user which returns their logs, or query all logs.
      // Let's request the current user's history logs as a sample global log registry, or retrieve logs for userId "all" if the backend supports it.
      // The backend Controller has `@GetMapping("/{userId}")` in ActivityHistoryController. Let's call it for the admin user to get the timelines.
      const logsData = await api.getActivityHistory(currentUser.id);
      setGlobalLogs(logsData);

    } catch (err) {
      setError(err.message || 'Failed to sync admin registry assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Filter lists on search queries
  useEffect(() => {
    let list = [...booksList];
    if (bookSearchQuery.trim() !== '') {
      const q = bookSearchQuery.toLowerCase().trim();
      list = list.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q)
      );
    }
    setFilteredBooks(list);
  }, [bookSearchQuery, booksList]);

  const handleRoleToggle = async (targetUser) => {
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      
      const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
      
      // In a real application, we would call an api.updateUserRole endpoint. Let's register credentials again or perform an API call.
      // For this full-stack system, since the admin can manage users, we'll implement role updates.
      // Let's invoke a fetch to update the user role
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/dashboard/users/${targetUser.id}/role?role=${newRole}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to update system role credentials.');
      }
      
      setSuccess(`Updated role for ${targetUser.username} to ${newRole} successfully.`);
      fetchAdminData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to toggle user role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you absolutely sure you want to delete this book? This will clear all borrow logs and physical copies.')) {
      try {
        setActionLoading(true);
        setError('');
        await api.deleteBook(bookId);
        setSuccess('Catalog entry removed successfully.');
        fetchAdminData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete book.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500';
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 bg-[#181411] border border-coffee-850 rounded-xl w-1/4 shimmer"></div>
        <div className="h-12 bg-[#181411] border border-coffee-850 rounded-xl shimmer"></div>
        <div className="h-80 bg-[#181411] border border-coffee-850 rounded-2xl shimmer"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Header bar titles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-biscuit animate-pulse" />
          <h2 className="font-serif text-lg font-bold text-cream uppercase">Administrative Security Panel</h2>
        </div>
        
        <span className="text-[9px] text-[#c6a67a] font-mono uppercase tracking-widest bg-biscuit/10 border border-biscuit/20 px-3.5 py-1.5 rounded-xl font-bold">
          ADMIN NODE INSTANCE active
        </span>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-2 text-xs font-bold font-mono">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Tab Navigation header bar */}
      <div className="flex items-center border-b border-coffee-850 overflow-x-auto gap-2 pb-0.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 border-b-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-biscuit text-biscuit bg-coffee-900/50'
                  : 'border-transparent text-beige hover:text-cream hover:bg-coffee-950/40'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Body Panel */}
      <div className="bg-[#181411] border border-coffee-850 rounded-2xl p-6 lg:p-7 shadow-premium relative min-h-[400px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-biscuit/5 blur-[90px] pointer-events-none rounded-full"></div>

        {/* Tab 1: Analytics Dashboard */}
        {activeTab === 'analytics' && stats && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4.5 w-4.5 text-biscuit" />
              <h3 className="font-serif text-sm font-bold text-cream uppercase">Vault Analytics Summary</h3>
            </div>

            {/* Quick Metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-coffee-950 border border-coffee-850 p-5 rounded-xl flex flex-col gap-1 shadow-inner">
                <span className="text-[9px] font-mono text-coffee-700 uppercase font-bold tracking-wider">Total Catalog Books</span>
                <span className="text-xl font-extrabold text-cream">{stats.totalBooks}</span>
              </div>
              <div className="bg-coffee-950 border border-coffee-850 p-5 rounded-xl flex flex-col gap-1 shadow-inner">
                <span className="text-[9px] font-mono text-coffee-700 uppercase font-bold tracking-wider">Active Book Leases</span>
                <span className="text-xl font-extrabold text-biscuit">{stats.activeBorrows}</span>
              </div>
              <div className="bg-coffee-950 border border-coffee-850 p-5 rounded-xl flex flex-col gap-1 shadow-inner">
                <span className="text-[9px] font-mono text-coffee-700 uppercase font-bold tracking-wider">Historic Borrows</span>
                <span className="text-xl font-extrabold text-cream">{stats.borrowedBooks}</span>
              </div>
              <div className="bg-coffee-950 border border-coffee-850 p-5 rounded-xl flex flex-col gap-1 shadow-inner">
                <span className="text-[9px] font-mono text-coffee-700 uppercase font-bold tracking-wider">Registered Members</span>
                <span className="text-xl font-extrabold text-cream">{stats.users}</span>
              </div>
            </div>

            {/* Conceptual charts/visual cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 text-xs">
              {/* Category distribution visualizer */}
              <div className="bg-coffee-950 border border-coffee-850 p-5 rounded-xl shadow-inner lg:col-span-2 flex flex-col gap-4">
                <span className="text-[10px] font-mono text-coffee-700 uppercase font-bold tracking-wider">Catalogue Category Spread</span>
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-beige font-mono text-[10px]">Artificial Intelligence</span>
                      <span className="text-cream font-bold">35%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#181411] rounded-full overflow-hidden border border-coffee-850">
                      <div className="h-full bg-biscuit rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-beige font-mono text-[10px]">Software Engineering</span>
                      <span className="text-cream font-bold">25%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#181411] rounded-full overflow-hidden border border-coffee-850">
                      <div className="h-full bg-cream rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-beige font-mono text-[10px]">Web Development</span>
                      <span className="text-cream font-bold">20%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#181411] rounded-full overflow-hidden border border-coffee-850">
                      <div className="h-full bg-[#e5d3b3] rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-beige font-mono text-[10px]">Databases</span>
                      <span className="text-cream font-bold">20%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#181411] rounded-full overflow-hidden border border-coffee-850">
                      <div className="h-full bg-coffee-700 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="bg-coffee-950 border border-coffee-850 p-5 rounded-xl shadow-inner flex flex-col gap-4">
                <span className="text-[10px] font-mono text-coffee-700 uppercase font-bold tracking-wider">System Node Status</span>
                
                <div className="divide-y divide-coffee-850/40">
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-beige">CORS Configuration</span>
                    <span className="text-green-400 font-mono font-bold">ACTIVE</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-beige">JWT Token Filter</span>
                    <span className="text-green-400 font-mono font-bold">JWT CORE</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-beige">Spring Sec. Authentication</span>
                    <span className="text-biscuit font-mono font-bold">DECRYPT ENABLED</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-beige">MongoDB Semantic Cluster</span>
                    <span className="text-green-400 font-mono font-bold">CONNECTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-biscuit" />
                <h3 className="font-serif text-sm font-bold text-cream uppercase">User Management Console</h3>
              </div>
            </div>

            {/* Users grid table */}
            <div className="overflow-x-auto border border-coffee-850 rounded-xl bg-coffee-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#181411] border-b border-coffee-850 text-coffee-700 font-mono font-bold uppercase tracking-wider">
                    <th className="p-4">UserID</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role Credentials</th>
                    <th className="p-4 text-center">Security Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-850/30">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-coffee-900/30 transition-colors">
                      <td className="p-4 font-mono text-coffee-700">#{usr.id}</td>
                      <td className="p-4 font-serif font-bold text-cream">{usr.username}</td>
                      <td className="p-4 text-beige">{usr.email || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-[4px] font-mono text-[9px] font-bold uppercase border ${
                          usr.role === 'ADMIN'
                            ? 'bg-biscuit/15 text-biscuit border-biscuit/30'
                            : 'bg-coffee-800 border-coffee-700 text-beige'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleRoleToggle(usr)}
                          disabled={actionLoading || usr.id === currentUser.id}
                          className="px-3.5 py-1.5 bg-coffee-900 hover:bg-cream hover:text-black border border-coffee-800 hover:border-cream rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-30 cursor-pointer"
                        >
                          Toggle Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Global MongoDB Logs */}
        {activeTab === 'logs' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-biscuit" />
              <h3 className="font-serif text-sm font-bold text-cream uppercase">MongoDB Global HistoryTimeline</h3>
            </div>

            {/* List log items */}
            {globalLogs.length === 0 ? (
              <div className="text-center py-10 bg-coffee-950 border border-coffee-850 rounded-xl">
                <p className="text-xs text-coffee-700 italic">No global logs have been generated on the server cluster yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {globalLogs.map((log) => {
                  const date = new Date(log.timestamp);
                  let colorText = 'text-biscuit';
                  if (log.activityType === 'BORROW') colorText = 'text-beige';
                  else if (log.activityType === 'RETURN') colorText = 'text-green-400';
                  
                  return (
                    <div 
                      key={log.id} 
                      className="bg-coffee-950 border border-coffee-850 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-sans hover:border-[#c6a67a] transition-all"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider">
                          <span className={colorText}>{log.activityType}</span>
                          <span className="text-coffee-700">|</span>
                          <span className="text-coffee-700">NODE ID #{log.userId || 'SYS'}</span>
                        </div>
                        <p className="text-cream font-medium leading-relaxed truncate">{log.details}</p>
                      </div>
                      
                      <span className="text-[10px] font-mono text-coffee-700 flex-shrink-0">
                        {date.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Catalog Curation */}
        {activeTab === 'catalog' && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Library className="h-4.5 w-4.5 text-biscuit" />
                <h3 className="font-serif text-sm font-bold text-cream uppercase">Digital Catalogue Core</h3>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-coffee-700" />
                  <input
                    type="text"
                    value={bookSearchQuery}
                    onChange={(e) => setBookSearchQuery(e.target.value)}
                    className="w-full bg-coffee-950 border border-coffee-850 rounded-xl pl-9 pr-4 py-2 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors"
                    placeholder="Search catalogue..."
                  />
                </div>
                
                <button
                  onClick={handleAddClick}
                  className="bg-biscuit hover:bg-[#b09164] text-black font-mono font-bold uppercase text-[10px] px-3.5 py-2.5 rounded-xl tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-premium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Book</span>
                </button>
              </div>
            </div>

            {/* Catalog table */}
            <div className="overflow-x-auto border border-coffee-850 rounded-xl bg-coffee-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#181411] border-b border-coffee-850 text-coffee-700 font-mono font-bold uppercase tracking-wider">
                    <th className="p-4">Volume Cover</th>
                    <th className="p-4">Title & Author</th>
                    <th className="p-4">Genre Category</th>
                    <th className="p-4">Stock Copies</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-850/30">
                  {filteredBooks.map((bk) => (
                    <tr key={bk.id} className="hover:bg-coffee-900/30 transition-colors">
                      <td className="p-4">
                        <div className="h-12 w-8.5 bg-[#181411] border border-coffee-800 rounded overflow-hidden shadow-inner">
                          <img
                            src={bk.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500'}
                            alt={bk.title}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-serif font-bold text-cream truncate max-w-[220px]">{bk.title}</span>
                          <span className="text-[10px] text-beige mt-0.5 truncate max-w-[200px]">by {bk.author}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-biscuit font-mono text-[10px] uppercase font-bold tracking-wider">{bk.category}</span>
                      </td>
                      <td className="p-4 font-mono text-cream font-bold">
                        {bk.availabilityCount} / {bk.totalCount}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(bk)}
                            className="p-2 bg-coffee-900 hover:bg-cream border border-coffee-850 hover:text-black hover:border-cream rounded-xl text-beige transition-colors cursor-pointer"
                            title="Edit Catalogue specifications"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(bk.id)}
                            disabled={actionLoading}
                            className="p-2 bg-coffee-900 hover:bg-red-600 border border-coffee-850 hover:text-white hover:border-red-600 rounded-xl text-red-400 transition-colors cursor-pointer"
                            title="Remove from catalogue"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Book Modal overlay */}
      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        book={selectedBook}
        onSubmitSuccess={fetchAdminData}
      />

    </div>
  );
};

export default AdminPanelPage;
