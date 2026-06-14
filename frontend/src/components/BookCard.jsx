import React from 'react';

import {
  User,
  Tag,
  ArrowRight
} from 'lucide-react';

import { Link } from 'react-router-dom';

const BookCard = ({
  book,
  user,
  onBorrow,
  onReturn,
  isBorrowedByUser,
  onEditClick
}) => {

  const isAvailable =
    book.quantity > 0;

  const isAdmin =
    user?.role === 'ADMIN';

  const handleImageError = (e) => {

    e.target.src =
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500';
  };

  return (

    <div className="bg-[#181411] border border-coffee-850 rounded-2xl overflow-hidden hover:border-[#c6a67a] hover:shadow-premium-hover hover:scale-[1.01] transition-all duration-300 flex flex-col group h-full">

      {/* IMAGE */}
      <div className="h-56 relative bg-coffee-950 overflow-hidden flex items-center justify-center border-b border-coffee-850">

        <img
          src={
            book.imageUrl ||
            'https://images.unsplash.com/photo-1512820790803-83ca734da794'
          }

          alt={book.title}

          onError={handleImageError}

          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"

          loading="lazy"
        />

        {/* STOCK BADGE */}
        <div className="absolute top-3 right-3 z-10">

          <span
            className={`px-2.5 py-1 rounded-[6px] font-mono text-[9px] font-bold uppercase tracking-wider border ${
              isAvailable
                ? 'bg-[#181411]/90 text-[#c6a67a] border-[#c6a67a]/30'
                : 'bg-red-950/90 text-red-400 border-red-900/30'
            }`}
          >

            {isAvailable
              ? `${book.quantity} In Stock`
              : 'Out of Stock'}

          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-grow flex flex-col gap-3">

        {/* CATEGORY */}
        <div className="flex items-center gap-1.5">

          <Tag className="h-3 w-3 text-[#c6a67a]" />

          <span className="text-[9px] text-[#c6a67a] font-mono uppercase tracking-wider font-semibold">

            {book.category}

          </span>
        </div>

        {/* TITLE */}
        <div className="flex flex-col gap-1">

          <h3 className="font-serif text-sm font-bold text-cream group-hover:text-[#c6a67a] line-clamp-1 transition-colors">

            {book.title}

          </h3>

          <span className="text-xs text-beige flex items-center gap-1 leading-none">

            <User className="h-3 w-3 text-coffee-700" />

            {book.author}

          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-[11px] text-coffee-700 leading-relaxed line-clamp-2 mt-1">

          {book.summary ||
            'No summary text provided for this library catalog item.'}

        </p>
      </div>

      {/* FOOTER */}
      <div className="p-5 pt-0 border-t border-coffee-850/30 mt-auto flex flex-col gap-2.5">

        <div className="flex items-center gap-2">

          {/* DETAILS */}
          <Link
            to={`/books/${book.id}`}

            className="flex-1 flex items-center justify-center gap-1.5 bg-coffee-900 border border-coffee-850 hover:bg-[#c6a67a] hover:text-black hover:border-[#c6a67a] text-[#c6a67a] py-2 rounded-xl text-[10px] font-mono uppercase font-bold tracking-wider transition-all duration-300"
          >

            <span>
              Catalogue Details
            </span>

            <ArrowRight className="h-3 w-3" />
          </Link>

          {/* ADMIN EDIT */}
          {isAdmin && (

            <button
              onClick={() =>
                onEditClick(book)
              }

              className="px-3.5 py-2 bg-coffee-850 hover:bg-cream hover:text-black rounded-xl border border-coffee-800 text-cream text-[10px] font-mono font-bold uppercase transition-all duration-300"
            >

              Edit

            </button>
          )}
        </div>

        {/* BORROW BUTTON */}
        {!isAdmin && user && (

          <div className="w-full">

            {isBorrowedByUser ? (

              <button
                onClick={() =>
                  onReturn(book.id)
                }

                className="w-full py-2.5 bg-red-950/20 hover:bg-red-600 hover:text-white border border-red-900 text-red-400 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-300"
              >

                Return Book

              </button>

            ) : (

              <button
                onClick={() =>
                  onBorrow(book.id)
                }

                disabled={!isAvailable}

                className="w-full py-2.5 bg-biscuit hover:bg-[#b09164] text-black border border-[#c6a67a] disabled:opacity-30 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-300"
              >

                {isAvailable
                  ? 'Borrow Book'
                  : 'Out Of Stock'}

              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;