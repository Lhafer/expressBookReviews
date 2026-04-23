const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(403).json({message: "Username, Password, or Both not Provided"})
    }
    const user = users.find(user => user.username === username && user.password === password)
    if (!user){
        return res.status(403).json({message: "Username, Password, or Both are Incorrect"})
    } 
    const token = jwt.sign({
        data : username
    }, 'fingerprint_customer', { 
        expiresIn : 60 * 60 
    })

    req.session.authorization = {
        token, username
    }
    return res.status(200).json({message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.review;
  const reviews = books[req.params.isbn].reviews
  console.log(req.user)
  if(reviews) {
    reviews[req.user.data] = review;
  }
  return res.status(200).send(reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const reviews = books[req.params.isbn].reviews
    books[req.params.isbn].reviews =


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
