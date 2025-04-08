//Import all the modules and the database that we need for the program.
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('books.db');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Here we create a class for books with all the atributes
class Book {
    constructor(id, author, title, genre, price) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.genre = genre;
        this.price = price;
    }
}

//In this function we insert a new book in the table "books" of our database.
//We don't give id a value because it takes by itself and it's auto increased.
async function addBook(db,book){
    try {
        const q = `insert into books (author,title,genre,price) values ("${book.author}","${book.title}","${book.genre}",${book.price})`;
        console.log(q);
        db.run(q);
        console.log("\nNew book inserted!\nThose are all saved books of the 'books' database:\n");
        console.log(await getAllBooks(db));
    } catch (err) {
        throw err;
    }
}

//Here we get all books from the database.
//Then assign each book into an object, add it into an array of objects "books" and returning the array.
async function getAllBooks(db){
    const q = 'select * from books';
    const rows=await runQuery(db,q);
    books = [];
    for(row of rows){
        book = new Book(row.id,row.author,row.title,row.genre,row.price);
        books.push(book);
    }
    return books;     
}

//Getting all books from the database that contains the keyword given by the user.
//Again assigning each book into an object, add it into an array of objects and returning it.
async function getBooksByKeyword(db,k){
    const q = `select * from books where title like "%${k}%" or author like "%${k}%" or genre like "%${k}%" or price like "%${k}%"`;
    const rows=await runQuery(db,q);
    books = [];
    for(row of rows){
        book = new Book(row.id,row.author,row.title,row.genre,row.price);
        books.push(book);
    }
    return books;
}

//Searching all the books from the table of database with the parameter "q" that is given each time as a command and returnig them.
function runQuery(db,q){
    return new Promise((resolve,reject)=>{
        db.all(q,(err,rows)=>{
            if(err){
                console.log('\nError accessing the DB.\n');
                reject(err);
            }
            resolve(rows);
        });
    });
}

app.use(bodyParser.json());

//With each request we allow the following things that let both client and server run at the same port.
//Found this at: https://stackoverflow.com/questions/10636611/how-does-the-access-control-allow-origin-header-work
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


//A get method that shows all the books if no keyword is given
app.get('/books', async (req, res)=>{
    try {
        const books = await getAllBooks(db);
        if(Object.keys(books).length === 0){
            res.json('No books were found!');
        }else{
            res.json(books);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//A get method that gets all the books with the given keyword and returns a json with them.
//It calls getBooksByKeyword function to serach for the books with th keyword.
app.get('/books/:keyword', async (req, res)=>{
    try {
        const keyword = req.params.keyword;
        const book = await getBooksByKeyword(db,keyword);
        //For empty json we print that no books were found.
        //Found this at: https://www.scaler.com/topics/check-if-object-is-empty-javascript/
        if(Object.keys(book).length === 0){
            res.json('No books were found!');
        }else{
            res.json(book);
        }        
    } catch (err) {
        res.status(500).send(err);
    }
});

//A post method that takes as a request all the inputs and calls the addBook function to add the book with them.
//It returns a json message to confirm the insert of the book or an error message if something is wrong.
app.post('/books/', (req, res)=>{
    const book = req.body; 
    console.log("\n");
    console.log(req.body);
    console.log("\n");
    try {
        addBook(db,book);
        res.status(200).send({'result':'OK'});
    } catch (err) {
        res.status(500).send(err);
    }
});

//Server is running in port 3000
app.listen(3000);

//Using main method to wellcome the user and show them (in terminal) every time program starts, all the books that database has. 
async function main() {
    try{    
        console.log("Wellcome!\nThose are all saved books of the 'books' database:\n");
        const result = await getAllBooks(db);
        console.log(result);
    }catch(err){
        console.error(err.message);
    }
}

main();