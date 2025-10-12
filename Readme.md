# Books Collection Web-App with HTML & Javascript

## Installation & Execution Commands

### 1. Install modules:

```bash
npm install
```

### 2. Start backend server:

```bash
npm start
```

### 3. Open frontend `index.html` file in a browser.

---

## Usefull database commands (sqlite3)

### Get into the database:

```bash
sqlite3 books.db
```

### Create table (gets created automatically anyway):

```bash
CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, author VARCHAR(25) NOT NULL, title VARCHAR(40) NOT NULL, genre VARCHAR(20) NOT NULL, price FLOAT NOT NULL);
```

### Print table:

```bash
SELECT * books;
```

### Delete a row from the table by id (replace `<id>`):

```bash
DELETE FROM books WHERE id = <id>;
```

### Drop table:

```bash
DROP TABLE books;
```
