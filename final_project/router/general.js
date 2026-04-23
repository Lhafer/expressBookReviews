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
public_users.get('/',async function (req, res) {
    const bookProm = new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books not found");
        }
    });
    try {
        const availableBooks = await bookProm;
        return res.send(JSON.stringify(availableBooks, null, 4))
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;  // get isbn from request params

    const bookProm = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    try {
        const book = await bookProm;
        res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {

 const bookProm = new Promise((resolve, reject)=>{
    const matches = Object.values(books).filter(book => book.author === req.params.author)
    if (matches){
        resolve(matches)
    } else {
        reject("No books found");
    }
    })
    try {
        const matches = await bookProm
        return res.status(200).send(JSON.stringify(matches, null, 4))
    } catch (error) {
        res.status(404).json({ message: error });
    }


});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const bookProm = new Promise((resolve, reject)=>{
        const matches = Object.values(books).filter(book => book.title === req.params.title)
        if (matches){
            resolve(matches)
        } else {
            reject("No books found");
        }
     })
        try {
            const matches = await bookProm
            return res.status(200).send(JSON.stringify(matches, null, 4))
        } catch (error) {
            res.status(404).json({ message: error });
        }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  return res.status(200).send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
