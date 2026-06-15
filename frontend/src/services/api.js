const BASE_URL = "http://localhost:8000/api";

const getHeaders = () => {

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {

    headers['Authorization'] =
      `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {

    if (response.status === 401) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.dispatchEvent(
        new Event('auth-change')
      );
    }

    const error =
      (data && data.message) ||
      response.statusText ||
      'API execution failed';

    throw new Error(error);
  }

  return data;
};

export const api = {

  // =========================
  // ACTIVITY HISTORY
  // =========================

  getActivityHistory: async () => {

    return [

      {
        id: 1,
        action: 'Admin logged in',
        timestamp: '2 mins ago',
      },

      {
        id: 2,
        action: 'Java Programming book added',
        timestamp: '10 mins ago',
      },

      {
        id: 3,
        action: 'User borrowed Python Basics',
        timestamp: '25 mins ago',
      },

      {
        id: 4,
        action: 'Semantic search executed',
        timestamp: '1 hour ago',
      },
    ];
  },

  // =========================
  // USERS
  // =========================

  getUsers: async () => {

    return [

      {
        id: 1,
        username: 'admin',
        role: 'ADMIN',
        email: 'admin@gmail.com',
      },

      {
        id: 2,
        username: 'manager',
        role: 'MANAGER',
        email: 'manager@gmail.com',
      },

      {
        id: 3,
        username: 'user',
        role: 'USER',
        email: 'user@gmail.com',
      },
    ];
  },

  // =========================
  // AUTHENTICATION
  // =========================

  login: async (username, password) => {

    const res = await fetch(
      `${BASE_URL}/auth/signin`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await handleResponse(res);

    if (data && data.token) {

      localStorage.setItem(
        'token',
        data.token
      );

      localStorage.setItem(
        'user',

        JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        })
      );

      window.dispatchEvent(
        new Event('auth-change')
      );
    }

    return data;
  },

  register: async (
    username,
    email,
    password,
    role = 'USER'
  ) => {

    const res = await fetch(
      `${BASE_URL}/auth/signup`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      }
    );

    return handleResponse(res);
  },

  logout: () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    localStorage.removeItem('borrowedBooks');

    window.dispatchEvent(
      new Event('auth-change')
    );
  },

  getCurrentUser: () => {

    const user =
      localStorage.getItem('user');

    return user
      ? JSON.parse(user)
      : null;
  },

  // =========================
  // BOOKS CRUD
  // =========================

  getBooks: async () => {
  return [
    {
      id: 1,
      title: "Java Programming",
      author: "Herbert Schildt",
      category: "Programming"
    },
    {
      id: 2,
      title: "Python Basics",
      author: "Eric Matthes",
      category: "Programming"
    },
    {
      id: 3,
      title: "Database Systems",
      author: "Korth",
      category: "DBMS"
    }
  ];
},

  // FIXED BOOK DETAILS
  getBookById: async (id) => {

    const res = await fetch(
      `${BASE_URL}/books`,
      {
        headers: getHeaders(),
      }
    );

    const books =
      await handleResponse(res);

    const book =
      books.find(
        (b) =>
          String(b.id) === String(id)
      );

    if (!book) {

      throw new Error(
        'Book not found'
      );
    }

    return book;
  },

  searchBooks: async (query) => {

    const books =
      await api.getBooks();

    const searchText =
      query.toLowerCase();

    return books.filter((book) => {

      return (

        book.title
          ?.toLowerCase()
          .includes(searchText) ||

        book.author
          ?.toLowerCase()
          .includes(searchText) ||

        book.category
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  },

  createBook: async (bookDto) => {

    const res = await fetch(
      `${BASE_URL}/books`,
      {
        method: 'POST',

        headers: getHeaders(),

        body: JSON.stringify(bookDto),
      }
    );

    return handleResponse(res);
  },

  updateBook: async (id, bookDto) => {

    const res = await fetch(
      `${BASE_URL}/books/${id}`,
      {
        method: 'PUT',

        headers: getHeaders(),

        body: JSON.stringify(bookDto),
      }
    );

    return handleResponse(res);
  },

  deleteBook: async (id) => {

    const res = await fetch(
      `${BASE_URL}/books/${id}`,
      {
        method: 'DELETE',

        headers: getHeaders(),
      }
    );

    return handleResponse(res);
  },

  // =========================
  // BORROW SYSTEM
  // =========================

  borrowBook: async (book) => {

    const existing =
      JSON.parse(
        localStorage.getItem('borrowedBooks')
      ) || [];

    const alreadyBorrowed =
      existing.find(
        (b) => b.id === book.id
      );

    if (alreadyBorrowed) {

      throw new Error(
        'Book already borrowed'
      );
    }

    existing.push(book);

    localStorage.setItem(
      'borrowedBooks',
      JSON.stringify(existing)
    );

    return {
      success: true,
      message:
        'Book borrowed successfully',
    };
  },

  returnBook: async (bookId) => {

    const existing =
      JSON.parse(
        localStorage.getItem('borrowedBooks')
      ) || [];

    const updated =
      existing.filter(
        (b) => b.id !== bookId
      );

    localStorage.setItem(
      'borrowedBooks',
      JSON.stringify(updated)
    );

    return {
      success: true,
      message:
        'Book returned successfully',
    };
  },

  getUserActiveBorrows: async () => {

    return (
      JSON.parse(
        localStorage.getItem('borrowedBooks')
      ) || []
    );
  },

  // =========================
  // SEMANTIC SEARCH
  // =========================

  semanticSearch: async (query) => {

    const books =
      await api.getBooks();

    const searchText =
      query.toLowerCase();

    return books.filter((book) => {

      return (

        book.title
          ?.toLowerCase()
          .includes(searchText) ||

        book.author
          ?.toLowerCase()
          .includes(searchText) ||

        book.category
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  },

  // =========================
  // DASHBOARD STATS
  // =========================

  getDashboardStats: async () => {

    const books =
      await api.getBooks();

    const borrowedBooks =
      JSON.parse(
        localStorage.getItem('borrowedBooks')
      ) || [];

    return {

      totalBooks:
        books.length,

      availableBooks:
        books.length -
        borrowedBooks.length,

      borrowedBooks:
        borrowedBooks.length,

      activeUsers: 3,
    };
  },
};