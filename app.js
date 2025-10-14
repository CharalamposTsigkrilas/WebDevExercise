import sqlite3pkg from "sqlite3";
import express from "express";
import cors from "cors";

const sqlite3 = sqlite3pkg.verbose();
const db = new sqlite3.Database("books.db");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ---------------------
// Book model
// ---------------------
class Book {
  constructor(id, author, title, genre, price) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.genre = genre;
    this.price = price;
  }
}

// ---------------------
// Utility: run a query and return results
// ---------------------
function runQuery(db, query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// ---------------------
// Create table books if doesn't exist
// ---------------------
async function ensureBooksTable() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='books';",
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          console.log("Database 'books.db' with table 'books' is ready.");
          resolve();
        } else {
          const createTableQuery =
            "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, author VARCHAR(25) NOT NULL, title VARCHAR(40) NOT NULL, genre VARCHAR(20) NOT NULL, price FLOAT NOT NULL);";
          db.run(createTableQuery, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log("Table 'books' created successfully.");
              resolve();
            }
          });
        }
      }
    );
  });
}

// ---------------------
// CRUD Functions
// ---------------------

// Get all books
async function getAllBooks() {
  const q = "SELECT * FROM books";
  const rows = await runQuery(db, q);

  return rows.map(
    (row) => new Book(row.id, row.author, row.title, row.genre, row.price)
  );
}

// Get books by keyword (search in all fields)
async function getBooksByKeyword(keyword) {
  const q = `SELECT * FROM books WHERE id LIKE "%${keyword}%" OR title LIKE "%${keyword}%" OR author LIKE "%${keyword}%" OR genre LIKE "%${keyword}%" OR price LIKE "%${keyword}%"`;
  const rows = await runQuery(db, q);

  return rows.map(
    (row) => new Book(row.id, row.author, row.title, row.genre, row.price)
  );
}

// Insert a new book
async function addBook(book) {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO books (author, title, genre, price) values ("${book.author}", "${book.title}", "${book.genre}", ${book.price})`;
    db.run(q, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

// ---------------------
// Routes
// ---------------------

// Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json(books.length ? books : "No books were found!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get books by keyword
app.get("/books/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const books = await getBooksByKeyword(keyword);
    res.json(books.length ? books : "No books were found!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a new book
app.post("/books", async (req, res) => {
  try {
    const book = req.body;
    const result = await addBook(book);
    res.status(201).json({ message: "Book added!", id: result.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ---------------------
// Start the server
// ---------------------
app.listen(3000, async () => {
  console.log("Server running on http://localhost:3000.");

  // Print all books when the app starts
  try {
    await ensureBooksTable();

    const books = await getAllBooks();
    console.log("\nAll saved books in database:\n\n", books);
  } catch (err) {
    console.error("Error reading database:", err.message);
  }
});
