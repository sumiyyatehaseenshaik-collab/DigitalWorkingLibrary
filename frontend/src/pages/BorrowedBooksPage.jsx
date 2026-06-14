import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';

const BorrowedBooksPage = () => {

  const [borrowedRecords, setBorrowedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const user = api.getCurrentUser();

  const fetchBorrowedBooks = async () => {

    try {

      setLoading(true);

      const data = await api.getUserActiveBorrows();

      console.log("BORROWED DATA:", data);

      setBorrowedRecords(data || []);

    } catch (err) {

      console.error(err);

      setError(
        err.message || 'Failed to fetch borrowed books.'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchBorrowedBooks();

  }, []);

  const handleReturn = async (bookId) => {

    try {

      setError('');
      setSuccessMsg('');

      await api.returnBook(bookId);

      setSuccessMsg(
        'Book returned successfully!'
      );

      fetchBorrowedBooks();

      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);

    } catch (err) {

      setError(
        err.message || 'Failed to return book.'
      );
    }
  };

  const handleImageError = (e) => {

    e.target.src =
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500';
  };

  if (loading) {

    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-biscuit text-lg font-semibold">
          Loading borrowed books...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <Clock className="h-5 w-5 text-biscuit" />

          <h2 className="font-serif text-2xl font-bold text-cream uppercase">
            Borrowed Books Shelf
          </h2>

        </div>

        <div className="bg-biscuit/10 border border-biscuit/20 px-4 py-2 rounded-xl text-biscuit text-xs font-bold uppercase tracking-widest">
          {borrowedRecords.length} Active Leases
        </div>

      </div>

      {/* SUCCESS */}
      {successMsg && (

        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-2">

          <CheckCircle className="h-5 w-5" />

          <span>{successMsg}</span>

        </div>
      )}

      {/* ERROR */}
      {error && (

        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {borrowedRecords.length === 0 ? (

        <div className="text-center py-24 bg-[#181411] border border-coffee-850 rounded-3xl flex flex-col items-center gap-5">

          <BookOpen className="h-14 w-14 text-biscuit" />

          <h3 className="text-3xl font-serif font-bold text-cream">
            Your Personal Shelf Is Currently Vacant
          </h3>

          <p className="text-coffee-700 text-sm max-w-lg">
            Browse through the premium digital catalogue
            and borrow books to populate your active shelf.
          </p>

          <Link
            to="/books"
            className="bg-biscuit hover:bg-[#b09164] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300"
          >
            Launch Catalog Browser
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {borrowedRecords.map((record) => {

            const borrowDate = new Date(
              record.borrowDate
            );

            const dueDate = new Date(
              borrowDate
            );

            dueDate.setDate(
              dueDate.getDate() + 14
            );

            const timeDiff =
              dueDate.getTime() - new Date().getTime();

            const daysRemaining =
              Math.ceil(timeDiff / (1000 * 3600 * 24));

            const isOverdue = daysRemaining < 0;

            return (

              <div
                key={record.id}
                className="bg-[#181411] border border-coffee-850 rounded-3xl overflow-hidden hover:border-biscuit transition-all duration-300 shadow-premium"
              >

                {/* IMAGE */}
                <div className="h-64 overflow-hidden">

                  <img
                    src={
                      record.bookCover ||
                      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500'
                    }
                    alt={record.book?.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />

                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col gap-4">

                  <div>

                    <span className="text-[10px] uppercase tracking-widest text-biscuit font-bold">
                      Borrowed Copy
                    </span>

                    <h3 className="font-serif text-2xl text-cream font-bold mt-2">
                      {record.book?.title}
                    </h3>

                    <p className="text-beige mt-1">
                      {record.book?.author}
                    </p>

                  </div>

                  {/* DATES */}
                  <div className="flex flex-col gap-2 text-sm">

                    <div className="flex justify-between">

                      <span className="text-coffee-700">
                        Borrowed:
                      </span>

                      <span className="text-cream">
                        {borrowDate.toLocaleDateString()}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-coffee-700">
                        Due:
                      </span>

                      <span className="text-cream">
                        {dueDate.toLocaleDateString()}
                      </span>

                    </div>

                  </div>

                  {/* STATUS */}
                  {isOverdue ? (

                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-wider font-bold">

                      <ShieldAlert className="h-4 w-4" />

                      OVERDUE BY {Math.abs(daysRemaining)} DAYS

                    </div>

                  ) : (

                    <div className="bg-biscuit/10 border border-biscuit/20 text-biscuit p-3 rounded-xl flex justify-between text-xs uppercase tracking-wider font-bold">

                      <span>Remaining</span>

                      <span>{daysRemaining} Days</span>

                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="flex gap-3 pt-2">

                    <Link
                      to={`/books/${record.book?.id}`}
                      className="flex-1 bg-coffee-950 border border-coffee-850 hover:bg-coffee-900 text-beige py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all duration-300"
                    >
                      Details
                    </Link>

                    <button
                      onClick={() =>
                        handleReturn(record.book?.id)
                      }
                      className="flex-1 bg-biscuit hover:bg-[#b09164] text-black py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300"
                    >
                      Return
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BorrowedBooksPage;