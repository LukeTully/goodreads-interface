var express = require('express');
var mustacheExpress = require('mustache-express');
var request = require('superagent');
var compression = require('compression');

// Create our express app
var app = express();

// Enable compression for testing purposes
app.use(compression());

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
// Set the view engine to use EJS as well as set the default views directory
app.set('view engine', 'mustache');
app.set('views', __dirname + '/public/views');

// This tells Express out of which directory to serve static assets like CSS and images
app.use(express.static(__dirname + '/public'));

// The homepage route of our application does not interface with the MovieAnalyst API and is always accessible. We won’t use the getAccessToken middleware here. We’ll simply render the index.ejs view.
app.get('/', function (req, res) {

    res.render('index');
});

app.get('/books', function (req, res) {
    request
        .get('http://localhost:8080/books')
        .query({
            q: req.query.q
        })
        .end(function (err, data) {
            if (err) {
                if (data.status == 403) {
                    return res.status(403).send('403 Forbidden');
                } else if (data.status == 404) {
                    return res.status(404).send('404');
                }
            } else {
                var books = data.body;

                if (req.get('Accepts') == 'application/json') {
                    return res.send(books);
                }
                return res.render('index', { 'books': books });
            }

        })
});

// Our Book Website will listen on port 3000. Feel free to change this as you see fit, just know that you can’t have multiple processes listening on the same port.
app.listen(3000);
