# Commands

## Install needed modules:
```bash
npm i
```

---

## Start the program:

### 1. Start backend:
```bash
npm start
```

### 2. Open frontend: 'index.html' file in a browser.

---

## Access into the database (sqlite3)

### Get into the database:
```bash
sqlite3 books.db
```

### Create table:
```bash
CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, author VARCHAR(25) NOT NULL, title VARCHAR(40) NOT NULL, genre VARCHAR(20) NOT NULL, price FLOAT NOT NULL);
```

### Drop table:
```bash
DROP TABLE books;
```

### Print table:
```bash
SELECT * books;
```

### Delete a row from the table by id:
```bash
DELETE FROM books WHERE id = <id>;
```
