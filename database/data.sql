-- ANTIGRAVITY DIGITAL LIBRARY
-- Seed Data for Users and Books
-- Default Passwords are: 'admin123' for admin, 'user123' for user

-- Insert initial users (Passwords are BCrypt hashed)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@antigravity.com', '$2a$10$p.l6N58Bq0647kM1xM2FceK/xP5e50G4fWzY3YdY18p5n2b.U5U8y', 'ADMIN'),
('user', 'user@antigravity.com', '$2a$10$h9703Z840YyWwV0hX2C9OeeK3j4rV8m2fWw/Y98w7QkR00P1p2gXv2', 'USER');

-- Insert 20 seeded books with real Unsplash covers
INSERT INTO books (title, author, category, summary, cover_image, availability_count, total_count) VALUES
(
  'Atomic Habits',
  'James Clear',
  'Career Development',
  'An easy and proven way to build good habits and break bad ones. James Clear provides an actionable guide to transforming your daily routines and achieving remarkable results.',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=500',
  5,
  5
),
(
  'Deep Learning',
  'Ian Goodfellow',
  'Artificial Intelligence',
  'A comprehensive textbook covering mathematical foundations, deep networks, optimization, and practical methodologies for modern artificial intelligence systems.',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500',
  4,
  4
),
(
  'The Clean Coder',
  'Robert C. Martin',
  'Software Engineering',
  'Professional techniques, disciplines, tools, and crafts for software development professionals. Learn how to estimate, code, refactor, and manage work properly.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500',
  3,
  3
),
(
  'Introduction to Algorithms',
  'Thomas H. Cormen',
  'Software Engineering',
  'The standard reference textbook on modern algorithms. Detailed analyses of graph systems, search patterns, sorting algorithms, and data architectures.',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=500',
  6,
  6
),
(
  'You Dont Know JS',
  'Kyle Simpson',
  'Web Development',
  'An in-depth exploration of core JavaScript mechanics. Master closures, prototypes, scopes, async generators, and high-performance frontend programming.',
  'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=500',
  5,
  5
),
(
  'Hooked',
  'Nir Eyal',
  'UI/UX Design',
  'A guide to building habit-forming products. Explores the psychology of why some products capture massive user attention while others fail to connect.',
  'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=500',
  4,
  4
),
(
  'Artificial Intelligence',
  'Stuart Russell',
  'Artificial Intelligence',
  'The standard reference for modern artificial intelligence systems. Covers state-space search, reinforcement learning, natural language vectors, and multi-agent systems.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500',
  5,
  5
),
(
  'Cracking the Coding Interview',
  'Gayle McDowell',
  'Career Development',
  '189 programming questions and solutions to prepare you for tech interviews at Google, Apple, Microsoft, and Amazon.',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=500',
  7,
  7
),
(
  'Design Patterns',
  'Erich Gamma',
  'Software Engineering',
  'The seminal work on reusable object-oriented software design. Defines creational, structural, and behavioral programming architectures.',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=500',
  4,
  4
),
(
  'Clean Code',
  'Robert C. Martin',
  'Software Engineering',
  'A handbook of agile software craftsmanship. Master writing readable, maintainable code, test-driven designs, and clean modular software architectures.',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=500',
  5,
  5
),
(
  'The Pragmatic Programmer',
  'Andrew Hunt',
  'Software Engineering',
  'Masterful advice on coding, teamwork, system design, testing, and career strategies. Learn what it means to be a modern software professional.',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500',
  4,
  4
),
(
  'Zero to One',
  'Peter Thiel',
  'Career Development',
  'Notes on startups, innovation, and how to build the future. Explores how to escape competition and build a monopoly through unique technology.',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=500',
  8,
  8
),
(
  'Refactoring',
  'Martin Fowler',
  'Software Engineering',
  'Improving the design of existing code. A detailed catalog of refactorings, complete with code examples, tests, and clean architecture advice.',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=500',
  3,
  3
),
(
  'Designing Data-Intensive Applications',
  'Martin Kleppmann',
  'Databases',
  'The definitive guide to database internals, distributed storage systems, replication, partitioning, consistency models, and transaction management.',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=500',
  6,
  6
),
(
  'Dont Make Me Think',
  'Steve Krug',
  'UI/UX Design',
  'A common sense approach to Web and Mobile usability. Explores intuitive navigation systems, clean information hierarchies, and UX principles.',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=500',
  5,
  5
),
(
  'Head First Design Patterns',
  'Eric Freeman',
  'Software Engineering',
  'A brain-friendly guide to design patterns. Master creational, structural, and behavioral patterns using visually rich learning theories.',
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=500',
  4,
  4
),
(
  'The Lean Startup',
  'Eric Ries',
  'Career Development',
  'How modern entrepreneurs use continuous innovation to create radically successful businesses. Focuses on validated learning and pivot models.',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=500',
  6,
  6
),
(
  'High Performance Browser Networking',
  'Ilya Grigorik',
  'Web Development',
  'What every web developer should know about networking protocols: HTTP/2, WebSockets, WebRTC, TCP, TLS, and browser performance optimization.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=500',
  4,
  4
),
(
  'The Design of Everyday Things',
  'Don Norman',
  'UI/UX Design',
  'The classic textbook on cognitive design. Explores how product designers can make everyday products usable, delightful, and natural to interact with.',
  'https://images.unsplash.com/photo-1498075702571-ecb018f3752d?auto=format&fit=crop&q=80&w=500',
  5,
  5
),
(
  'Eloquent JavaScript',
  'Marijn Haverbeke',
  'Web Development',
  'A modern introduction to programming, web development, and node.js. A deep, comprehensive book teaching clean syntax, objects, and functional javascript.',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=500',
  6,
  6
);
