const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a username already exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  let booksbyauthor = [];
  keys.forEach((key) => {
    if (books[key].author === author) {
      booksbyauthor.push({"isbn": key, "title": books[key].title, "reviews": books[key].reviews});
    }
  });
  if (booksbyauthor.length > 0) {
    return res.send(JSON.stringify({booksbyauthor}, null, 4));
  }
  return res.status(404).json({message: "No books found for this author"});
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  let booksbytitle = [];
  keys.forEach((key) => {
    if (books[key].title === title) {
      booksbytitle.push({"isbn": key, "author": books[key].author, "reviews": books[key].reviews});
    }
  });
  if (booksbytitle.length > 0) {
    return res.send(JSON.stringify({booksbytitle}, null, 4));
  }
  return res.status(404).json({message: "No books found with this title"});
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;