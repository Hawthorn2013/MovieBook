var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'database2017.c7dghyf3qfms.us-west-2.rds.amazonaws.com',
    user: 'database2017',
    password: '550database2017',
    database: 'Movie_RDS'
});
// var http = require('http');



connection.connect();
// var server = http.createServer(app);

app.set('views',__dirname + '/views');
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// homepage
app.get("/", function(req, res) {
    res.render("homepage");
});

// search box
app.post('/result', function(req, res) {
    var content = req.body.searchContent;
    // content = content.split("").join("''");
    var type = req.body.searchType;
    console.log(type);
    console.log(content);
    var query;
    // if(type=="title") {
        query = "SELECT distinct title from Movie WHERE title LIKE '%" + content + "%' LIMIT 50";
        connection.query(query, function (err, movies) {

            if (err) throw err;
            console.log(JSON.stringify(movies));
            // if(!movies){ res.render('404', { isLogin: isLogin }); return; }
            res.render('result', {movies: movies});
        });
    // }
});

app.get("/movie", function(req, res) {
	res.render("movie");
});

// movie details
app.get('/movie/:id', function(req, res) {
    var mid = req.params.id;
    console.log(mid);

    var query = "SELECT * FROM Movie WHERE imdbId = " + mid + "";
    connection.query(query, function (err, movies) {
        if(err) throw err;
        console.log(query);
        var movie = movies[0]["title"];
        res.render('movieDetails', {movie : movie});
    })
});

app.get('/login', function (req, res) {
    res.render('login');
    var uid = req.params.id;
    console.log(mid);

    var query = "SELECT * FROM Recommendation WHERE uid = " + uid +
                "Limit 5";
    connection.query(query, function (err, movies) {
        if(err) throw err;
        console.log(query);
        res.render('homepage/:id', {movie : movies});
    })

    res.render("homepage/:id");
});

// homepage after login with recommendation
app.get('/homepage/:id', function(req, res) {
    res.render('homepage/:id')
});

app.get('s')

app.listen(3000, function() {
	console.log("MovieBook Server Start!");
})

// server.listen(app.get('port'), function(){
//     console.log('Express server listening on port ' + app.get('port'));
// });