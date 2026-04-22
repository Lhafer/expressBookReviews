const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 const {username, password} = req.body;
 if (!username || !password){
    return res.status(403).json({message: "Username, Password, or Both not provided"});
 }
 if (!users.find(user => user.username === username)){
    users.push({username: username, password: password});
    return res.status(200).json({message : `User ${username} successfully registered`})
 } else {
    return res.status(403).json({message: "Username already in use"});
 }
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.status(200).send(JSON.stringify(books[req.params.isbn], null, 4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return res.status(200).send(Object.values(books).filter(book => book.author === req.params.author))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(200).send(Object.values(books).filter(book => book.title === req.params.title))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  return res.status(200).send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
