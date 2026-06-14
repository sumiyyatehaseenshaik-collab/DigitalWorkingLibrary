import React, {
  useEffect,
  useState
} from 'react';

import { api } from '../services/api';

import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';

import {
  Search,
  Plus,
  Filter,
  Library
} from 'lucide-react';

const CATEGORIES = [
  'All Genres',
  'Programming',
  'Artificial Intelligence',
  'Software Engineering',
  'Web Development',
  'Databases',
  'Computer Science',
  'Cloud',
  'Security',
  'Networking',
  'Operating Systems'
];

const BooksPage = () => {

  const [books, setBooks] =
    useState([]);

  const [filteredBooks,
    setFilteredBooks] =
    useState([]);

  const [borrowedBooks,
    setBorrowedBooks] =
    useState([]);

  const [activeCategory,
    setActiveCategory] =
    useState('All Genres');

  const [searchQuery,
    setSearchQuery] =
    useState('');

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState('');

  const user =
    api.getCurrentUser() || {};

  const isAdmin =
    user?.role === 'ADMIN';

  const [isModalOpen,
    setIsModalOpen] =
    useState(false);

  const [selectedBook,
    setSelectedBook] =
    useState(null);

  // =========================
  // FETCH DATA
  // =========================

  const fetchBooksData =
    async () => {

    try {

      setLoading(true);

      // FETCH BOOKS
      const booksList =
        await api.getBooks();

      setBooks(booksList || []);

      setFilteredBooks(
        booksList || []
      );

      // FETCH BORROWED BOOKS
      if (user?.id) {

        try {

          const borrowed =
            await api.getUserActiveBorrows(user.id);

          setBorrowedBooks(
            borrowed || []
          );

        } catch (borrowError) {

          console.log(
            'Borrow fetch skipped'
          );

          setBorrowedBooks([]);
        }
      }

      setError('');

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        'Failed to fetch books.'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchBooksData();

  }, []);

  // =========================
  // FILTER BOOKS
  // =========================

  useEffect(() => {

    let list = [...books];

    // CATEGORY FILTER
    if (
      activeCategory !==
      'All Genres'
    ) {

      list = list.filter(
        (b) =>
          b.category ===
          activeCategory
      );
    }

    // SEARCH FILTER
    if (
      searchQuery.trim() !== ''
    ) {

      const q =
        searchQuery
          .toLowerCase()
          .trim();

      list = list.filter(
        (b) =>

          b.title
            ?.toLowerCase()
            .includes(q) ||

          b.author
            ?.toLowerCase()
            .includes(q) ||

          b.category
            ?.toLowerCase()
            .includes(q)
      );
    }

    setFilteredBooks(list);

  }, [
    activeCategory,
    searchQuery,
    books
  ]);

  // =========================
  // BORROW BOOK
  // =========================

  const handleBorrow =
    async (bookId) => {

    try {

      const selectedBook =
        books.find(
          (book) =>
            book.id === bookId
        );

      if (!selectedBook) {

        alert('Book not found');

        return;
      }

      await api.borrowBook(
        selectedBook
      );

      setBorrowedBooks(
        (prev) => [
          ...prev,
          selectedBook
        ]
      );

      alert(
        'Book borrowed successfully!'
      );

    } catch (err) {

      alert(
        err.message ||
        'Borrow failed'
      );
    }
  };

  // =========================
  // RETURN BOOK
  // =========================

  const handleReturn =
    async (bookId) => {

    try {

      await api.returnBook(
        bookId
      );

      setBorrowedBooks(
        (prev) =>
          prev.filter(
            (book) =>
              book.id !== bookId
          )
      );

      alert(
        'Book returned successfully!'
      );

    } catch (err) {

      alert(
        'Return failed'
      );
    }
  };

  // =========================
  // EDIT BOOK
  // =========================

  const handleEditClick =
    (book) => {

      setSelectedBook(book);

      setIsModalOpen(true);
    };

  // =========================
  // ADD BOOK
  // =========================

  const handleAddClick =
    () => {

      setSelectedBook(null);

      setIsModalOpen(true);
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-[60vh] text-beige">

        Loading catalogue...

      </div>
    );
  }

  return (

    <div className="flex flex-col gap-8 animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <Library className="h-5 w-5 text-biscuit" />

          <h2 className="font-serif text-lg font-bold text-cream uppercase">

            Library Catalogue

          </h2>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-3 w-full md:w-auto">

          <div className="relative flex-grow md:w-80">

            <Search className="absolute left-3.5 top-3 h-4 w-4 text-coffee-700" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="w-full bg-coffee-900 border border-coffee-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-cream focus:outline-none focus:border-[#c6a67a]"
              placeholder="Search books..."
            />
          </div>

          {/* ADMIN BUTTON */}
          {isAdmin && (

            <button
              onClick={
                handleAddClick
              }
              className="bg-biscuit hover:bg-[#b09164] text-black font-mono font-bold uppercase text-xs px-4 py-3 rounded-xl transition-all flex items-center gap-2"
            >

              <Plus className="h-4 w-4" />

              Add Book

            </button>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (

        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-xs font-semibold">

          {error}

        </div>
      )}

      {/* CATEGORY FILTER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">

        <div className="flex-shrink-0 text-coffee-700 mr-2 flex items-center gap-1">

          <Filter className="h-3.5 w-3.5" />

          <span className="text-[10px] font-mono font-bold uppercase">

            Filter:

          </span>
        </div>

        {CATEGORIES.map((cat) => (

          <button
            key={cat}
            onClick={() =>
              setActiveCategory(cat)
            }
            className={`px-4 py-2 border rounded-xl text-xs font-bold uppercase transition-all flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-biscuit text-black'
                : 'bg-[#181411] border-coffee-850 text-beige hover:text-cream'
            }`}
          >

            {cat}

          </button>
        ))}
      </div>

      {/* BOOKS GRID */}
      {filteredBooks.length === 0 ? (

        <div className="text-center py-20 bg-[#181411] border border-coffee-850 rounded-2xl">

          <p className="text-beige text-sm font-semibold">

            No books found.

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {filteredBooks.map((book) => (

            <BookCard
              key={book.id}
              book={book}
              user={user}
              onBorrow={
                handleBorrow
              }
              onReturn={
                handleReturn
              }
              isBorrowedByUser={
                borrowedBooks.some(
                  (b) =>
                    b.id === book.id
                )
              }
              onEditClick={
                handleEditClick
              }
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      <BookModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        book={selectedBook}
        onSubmitSuccess={
          fetchBooksData
        }
      />
    </div>
  );
};

export default BooksPage;