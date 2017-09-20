var express = require('express');
var app = express();
var jwt = require('express-jwt');
var rsaValidation = require('auth0-api-jwt-rsa-validation');
var request = require('request');
var xml = require('xml2js');
var fs = require('fs');
var config = require('src/config');

// Implement the books API endpoint
app.get('/books', function (req, res) {

    if (!req.query.q || req.query.q === '') {
        return res.status(404).send('404 Page not found');
    }
    var author = req.query.q;
    var booksList = '';


    if (process.env.NODE_ENV === 'development') {
        // Read from a cached copy of the api response if we're in dev mode
        fs.readFile('./cache/author_list_response.xml', 'utf-8', (err, result) => {
            if (err) throw err;
            parseXML(result).then(function (bookResponseJson) {
                booksList = bookResponseJson.GoodreadsResponse.author[0].books[0].book;
                res.send(booksList);
            });
        });
    } else {
        // Get a list of books and their review scores
        request.get(`https://www.goodreads.com/api/author_url/${author}?key=${goodreads.key}`, function (err, response) {
            parseXML(response.body).then(function (result) {
                request.get(`https://www.goodreads.com/author/list/${result.GoodreadsResponse.author[0].$.id}?format=xml&key=${goodreads.key}`, function (err, result) {
                    parseXML(result.body).then(function (bookResponseJson) {
                        booksList = bookResponseJson.GoodreadsResponse.author[0].books[0].book;
                        res.send(booksList);
                    });
                });
            });
        });
    }


});

function parseXML(xmlString) {
    return new Promise(function (resolve, reject) {
        xml.parseString(xmlString, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });

}

// Launch our API Server and have it listen on port 8080.
app.listen(8080);

// Author's Books
//https://www.goodreads.com/author/list/1406384?format=xml&key=U5te80c4j6f4GRgIQWAhvA

// Authors https://www.goodreads.com/api/author_url/John%20Green?key=U5te80c4j6f4GRgIQWAhvA