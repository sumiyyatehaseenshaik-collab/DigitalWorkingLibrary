import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Artificial Intelligence',
  'Software Engineering',
  'Web Development',
  'UI/UX Design',
  'Career Development',
  'Databases'
];

const BookModal = ({ isOpen, onClose, book = null, onSubmitSuccess }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [totalCount, setTotalCount] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setCategory(book.category || CATEGORIES[0]);
      setSummary(book.summary || '');
      setCoverImage(book.coverImage || '');
      setTotalCount(book.totalCount || 5);
    } else {
      setTitle('');
      setAuthor('');
      setCategory(CATEGORIES[0]);
      setSummary('');
      setCoverImage('');
      setTotalCount(5);
    }
    setError('');
  }, [book, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !category.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      title: title.trim(),
      author: author.trim(),
      category: category,
      summary: summary.trim(),
      coverImage: coverImage.trim(),
      totalCount: parseInt(totalCount, 10)
    };

    try {
      if (book) {
        await api.updateBook(book.id, payload);
      } else {
        await api.createBook(payload);
      }
      onSubmitSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit book data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay background */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Dialog */}
      <div className="relative bg-[#181411] border border-coffee-850 w-full max-w-lg rounded-2xl overflow-hidden shadow-premium animate-fade-in flex flex-col z-10 max-h-[90vh]">
        
        {/* Header bar */}
        <div className="h-16 border-b border-coffee-850 px-6 flex items-center justify-between bg-coffee-950">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-biscuit" />
            <h3 className="font-serif text-sm font-bold tracking-tight text-cream uppercase">
              {book ? 'Update Catalog Book' : 'Add New Library Book'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-coffee-700 hover:text-cream transition-colors cursor-pointer"
            title="Cancel and close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5.5">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-center text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Book Title */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
              Book Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-coffee-950 border border-coffee-850 rounded-xl px-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors shadow-inner"
              placeholder="e.g., Clean Architecture"
            />
          </div>

          {/* Book Author */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
              Author Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bg-coffee-950 border border-coffee-850 rounded-xl px-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors shadow-inner"
              placeholder="e.g., Robert C. Martin"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Select */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
                Genre Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-coffee-950 border border-coffee-850 rounded-xl px-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors cursor-pointer shadow-inner"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#181411] text-cream">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Count Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
                Total Stock Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={totalCount}
                onChange={(e) => setTotalCount(e.target.value)}
                className="bg-coffee-950 border border-coffee-850 rounded-xl px-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="bg-coffee-950 border border-coffee-850 rounded-xl px-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors shadow-inner"
              placeholder="e.g., https://example.com/cover.jpg"
            />
          </div>

          {/* Book Summary */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-[#c6a67a] uppercase">
              Book Summary
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="bg-coffee-950 border border-coffee-850 rounded-xl px-4 py-3 text-xs text-cream focus:outline-none focus:border-[#c6a67a] transition-colors resize-none shadow-inner"
              placeholder="Provide a brief synopsis of the book content..."
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 mt-4 border-t border-coffee-850/50 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-coffee-900 border border-coffee-850 text-beige hover:text-cream rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-biscuit hover:bg-[#b09164] text-black rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-premium"
            >
              {loading ? 'Submitting...' : book ? 'Save Changes' : 'Create Book'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default BookModal;
