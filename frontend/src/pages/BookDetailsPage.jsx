import React, {
  useEffect,
  useState
} from 'react';

import {
  useParams,
  Link,
  useNavigate
} from 'react-router-dom';

import { api } from '../services/api';

import {
  ArrowLeft,
  User,
  Tag,
  BookOpen,
  ShieldAlert
} from 'lucide-react';

const BookDetailsPage = () => {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [book, setBook] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [isBorrowed,
    setIsBorrowed] =
    useState(false);

  const currentUser =
    api.getCurrentUser();

  const isAdmin =
    currentUser?.role ===
    'ADMIN';

  // =========================
  // FETCH BOOK
  // =========================

  const fetchBook =
    async () => {

    try {

      setLoading(true);

      const data =
        await api.getBookById(id);

      setBook(data);

      // CHECK BORROWED
      const borrowed =
        await api.getUserActiveBorrows();

      const alreadyBorrowed =
        borrowed.some(
          (b) =>
            b.id === data.id
        );

      setIsBorrowed(
        alreadyBorrowed
      );

    } catch (err) {

      setError(
        err.message ||
        'Failed to load book details.'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchBook();

  }, [id]);

  // =========================
  // BORROW
  // =========================

  const handleBorrow =
    async () => {

    try {

      await api.borrowBook(
        book
      );

      setIsBorrowed(true);

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
  // RETURN
  // =========================

  const handleReturn =
    async () => {

    try {

      await api.returnBook(
        book.id
      );

      setIsBorrowed(false);

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
  // DELETE
  // =========================

  const handleDelete =
    async () => {

    const confirmDelete =
      window.confirm(
        `Delete "${book.title}" ?`
      );

    if (!confirmDelete)
      return;

    try {

      await api.deleteBook(
        book.id
      );

      alert(
        'Book deleted successfully'
      );

      navigate('/books');

    } catch (err) {

      alert(
        err.message ||
        'Delete failed'
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="flex items-center justify-center py-20 text-biscuit">

        Loading book details...

      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !book) {

    return (

      <div className="text-center py-20 bg-[#181411] border border-coffee-850 rounded-2xl flex flex-col items-center gap-4">

        <ShieldAlert className="h-10 w-10 text-biscuit" />

        <p className="text-cream font-bold text-lg uppercase">

          {error || 'Book Not Found'}

        </p>

        <Link
          to="/books"
          className="text-biscuit hover:underline text-xs uppercase tracking-wider"
        >

          Return To Catalogue

        </Link>

      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="flex flex-col gap-8 animate-fade-in">

      {/* BACK */}
      <div>

        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-xs text-beige hover:text-biscuit uppercase tracking-wider"
        >

          <ArrowLeft className="h-4 w-4" />

          Back To Catalogue

        </Link>

      </div>

      {/* MAIN CARD */}
      <div className="bg-[#181411] border border-coffee-850 rounded-3xl overflow-hidden shadow-premium flex flex-col lg:flex-row">

        {/* IMAGE */}
        <div className="w-full lg:w-96 bg-coffee-950 p-8 flex items-center justify-center border-r border-coffee-850">

          <img
            src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500"
            alt={book.title}
            className="w-full max-w-[240px] rounded-2xl shadow-premium"
          />

        </div>

        {/* DETAILS */}
        <div className="flex-1 p-10 flex flex-col gap-6">

          {/* CATEGORY */}
          <div className="flex items-center gap-2">

            <Tag className="h-4 w-4 text-biscuit" />

            <span className="text-biscuit text-xs uppercase tracking-wider font-bold">

              {book.category}

            </span>

          </div>

          {/* TITLE */}
          <h1 className="font-serif text-4xl text-cream font-bold leading-tight">

            {book.title}

          </h1>

          {/* AUTHOR */}
          <div className="flex items-center gap-2 text-beige">

            <User className="h-4 w-4" />

            <span>

              Written by

              <span className="text-cream font-semibold ml-1">

                {book.author}

              </span>

            </span>

          </div>

          {/* STOCK */}
          <div className="bg-coffee-950 border border-coffee-850 p-5 rounded-2xl flex items-center justify-between max-w-md">

            <div className="flex flex-col">

              <span className="text-coffee-700 uppercase text-[10px] tracking-wider">

                Available Copies

              </span>

              <span className="text-biscuit text-2xl font-bold mt-1">

                {book.quantity}

              </span>

            </div>

            <BookOpen className="h-10 w-10 text-biscuit" />

          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-2">

            <h3 className="text-cream uppercase font-bold tracking-wider text-sm">

              Catalogue Description

            </h3>

            <p className="text-beige leading-relaxed text-sm">

              This digital catalogue volume belongs to the
              {` ${book.category} `}
              archive collection authored by
              {` ${book.author}.`}

            </p>

          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 pt-6 border-t border-coffee-850">

            {!isAdmin && (

              <>
                {isBorrowed ? (

                  <button
                    onClick={
                      handleReturn
                    }
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl uppercase text-xs font-bold tracking-wider transition-all"
                  >

                    Return Book

                  </button>

                ) : (

                  <button
                    onClick={
                      handleBorrow
                    }
                    className="px-6 py-3 bg-biscuit hover:bg-[#b09164] text-black rounded-xl uppercase text-xs font-bold tracking-wider transition-all"
                  >

                    Borrow Book

                  </button>
                )}
              </>
            )}

            {isAdmin && (

              <button
                onClick={
                  handleDelete
                }
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl uppercase text-xs font-bold tracking-wider transition-all"
              >

                Delete Book

              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookDetailsPage;