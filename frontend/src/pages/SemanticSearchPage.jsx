import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Sparkles,
  Search,
  Compass,
  Clock,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

import { Link as RouterLink } from 'react-router-dom';

const SUGGESTIONS = [
  'startup scaling strategies & growth methodologies',
  'robust relational and non-relational database architectures',
  'high-fidelity user interfaces & modern design psychology',
  'clean code and agile software development standards',
  'neural networks and large language model concepts'
];

const SemanticSearchPage = () => {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');

  const user = api.getCurrentUser();

  const fetchSearchHistory = async () => {
    try {

      if (user) {

        setHistoryLoading(true);

        const logs = await api.getActivityHistory(user.id);

        const searchLogs = logs
          .filter(log => log.activityType === 'SEARCH')
          .slice(0, 5);

        setSearchHistory(searchLogs);
      }

    } catch (err) {

      console.warn(
        "Failed to retrieve user query history logs:",
        err
      );

    } finally {

      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const handleSearch = async (searchQuery) => {

    const q = searchQuery || query;

    if (!q.trim()) return;

    setLoading(true);
    setError('');

    try {

      const data = await api.semanticSearch(
        q.trim(),
        user?.id
      );

      setResults(data || []);

      setTimeout(() => fetchSearchHistory(), 1000);

    } catch (err) {

      setError(
        err.message ||
        'Semantic search server did not respond.'
      );

    } finally {

      setLoading(false);
    }
  };

  const handleSuggestionClick = (sug) => {
    setQuery(sug);
    handleSearch(sug);
  };

  const handleHistoryClick = (histQuery) => {
    setQuery(histQuery);
    handleSearch(histQuery);
  };

  const handleImageError = (e) => {
    e.target.src =
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500';
  };

  return (

    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-biscuit animate-pulse" />

        <h2 className="font-serif text-lg font-bold text-cream uppercase">
          AI Cognitive Semantic Search
        </h2>
      </div>

      {/* Search Box */}
      <div className="bg-[#181411] border border-coffee-850 p-6 lg:p-8 rounded-2xl flex flex-col gap-6 shadow-premium relative">

        <div className="absolute top-0 right-0 w-48 h-48 bg-biscuit/5 blur-[70px] pointer-events-none rounded-full"></div>

        <div className="flex flex-col gap-1.5">

          <span className="text-[10px] text-biscuit font-mono uppercase font-bold tracking-widest flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" />
            <span>High-Dimensional Semantic Mapping Vector Core</span>
          </span>

          <h3 className="font-serif text-cream text-base font-bold mt-1">
            Query the Catalogue Conceptually
          </h3>

          <p className="text-coffee-700 text-xs leading-relaxed max-w-2xl">
            Type natural descriptions of what concepts,
            technologies, or subjects you are looking
            to research.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-4xl"
        >

          <div className="relative flex-grow">

            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-coffee-700" />

            <input
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              className="w-full bg-coffee-950 border border-coffee-850 rounded-xl pl-11.5 pr-4 py-3 text-xs text-cream focus:outline-none"
              placeholder="Search books..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-biscuit text-black font-bold px-6 py-3 rounded-xl"
          >

            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4 inline mr-2" />
                Search Vector
              </>
            )}

          </button>
        </form>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2">

          {SUGGESTIONS.map((sug, i) => (

            <button
              key={i}
              type="button"
              onClick={() =>
                handleSuggestionClick(sug)
              }
              className="text-[10px] bg-coffee-950 border border-coffee-850 px-3 py-2 rounded-lg"
            >
              "{sug}"
            </button>

          ))}
        </div>
      </div>

      {/* Error */}
      {error && (

        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {results.length === 0 ? (

          <div className="text-center py-20 bg-[#181411] border border-coffee-850 rounded-2xl flex flex-col items-center justify-center gap-3">

            <HelpCircle className="h-10 w-10 text-coffee-700" />

            <p className="text-beige text-xs font-semibold">
              No semantic results found.
            </p>

          </div>

        ) : (

          results.map((item) => (

            <div
              key={item.id}
              className="bg-[#181411] border border-coffee-850 p-5 rounded-2xl"
            >

              <div className="flex gap-4">

                <div className="h-20 w-14 bg-coffee-950 rounded overflow-hidden">

                  <img
                    src={
                      item.coverImage ||
                      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500'
                    }
                    alt={item.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>

                  <h4 className="font-serif text-sm font-bold text-cream">
                    {item.title}
                  </h4>

                  <span className="text-[11px] text-beige">
                    {item.author}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-coffee-850/30 flex items-center justify-between">

                <span className="text-[9px] text-[#c6a67a] font-mono uppercase tracking-widest font-bold">
                  {item.category}
                </span>

                <RouterLink
                  to={`/books/${item.id}`}
                  className="text-[10px] text-cream hover:text-biscuit flex items-center gap-1"
                >

                  <span>View</span>

                  <ChevronRight className="h-3.5 w-3.5" />
                </RouterLink>

              </div>

            </div>

          ))
        )}
      </div>
    </div>
  );
};

export default SemanticSearchPage;