var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'database2017.c7dghyf3qfms.us-west-2.rds.amazonaws.com',
    user: 'database2017',
    password: '550database2017',
    database: 'Movie_RDS'
});
// var http = require('http');



connection.connect();
mongoose.createConnection("mongodb://localhost/users");
app.use(require("express-session")({
    secret : "moviebook is the best",
    resave : false,
    saveUninitialized : false
}))

// var server = http.createServer(app);
app.set('views',__dirname + '/views');
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// homepage
app.get("/", function(req, res) {
    res.render("homepage");
});

// search page
app.get('/search', function (req, res) {
    res.render('search');
});


// search result page
app.post('/result', function(req, res) {
    var content = req.body.searchContent;
    // content = content.split("").join("''");
    var type = req.body.searchType;
    console.log(type);
    console.log(content);
    var query;
    if(type=="title") {
        query = "SELECT DISTINCT m.title, d.title_year, group_concat(g.genres Separator ', ') as genres, d.duration, d.country, d.actor_1_name, d.actor_2_name, " +
            "d.actor_3_name, d.movie_imdb_link, r.RottenTomatoes, r.Metacritic, r.IMDB, r.Fandango_Stars FROM " +
            "Movie m INNER JOIN movie_desc d ON m.imdbId = d.imdbId LEFT JOIN Movie_rate r ON m.imdbId = r.imdbId " +
            "INNER JOIN Genres g ON m.imdbId = g.imdbId WHERE m.title LIKE '%" + content + "%' group by m.title LIMIT 50";
        connection.query(query, function (err, movies) {
            if (err) throw err;
            // console.log(JSON.stringify(movies[0]["IMDB"]));
            // if(!movies){ res.render('404', { isLogin: isLogin }); return; }
            res.render('result', {movies: movies});
        });
    }
    if(type=="actors") {
        query = "SELECT DISTINCT m.title, d.title_year, group_concat(g.genres Separator ', ') as genres, d.duration, d.country, d.actor_1_name, d.actor_2_name, " +
            "d.actor_3_name, d.movie_imdb_link, r.RottenTomatoes, r.Metacritic, r.IMDB, r.Fandango_Stars FROM " +
            "Movie m INNER JOIN movie_desc d ON m.imdbId = d.imdbId LEFT JOIN Movie_rate r ON m.imdbId = r.imdbId " +
            "INNER JOIN Genres g ON m.imdbId = g.imdbId WHERE d.actor_1_name LIKE '%" + content + "%' OR d.actor_2_name " +
            "LIKE '%" + content + "%' OR d.actor_3_name LIKE '%" + content + "%' group by m.title LIMIT 50";
        connection.query(query, function (err, movies) {
            if (err) throw err;
            res.render('result', {movies: movies});
        });
    }
    if(type=="country") {
        query = "SELECT DISTINCT m.title, d.title_year, group_concat(g.genres Separator ', ') as genres, d.duration, d.country, d.actor_1_name, d.actor_2_name, " +
            "d.actor_3_name, d.movie_imdb_link, r.RottenTomatoes, r.Metacritic, r.IMDB, r.Fandango_Stars FROM " +
            "Movie m INNER JOIN movie_desc d ON m.imdbId = d.imdbId LEFT JOIN Movie_rate r ON m.imdbId = r.imdbId " +
            "INNER JOIN Genres g ON m.imdbId = g.imdbId WHERE d.country LIKE '%" + content + "%' group by m.title LIMIT 50";
        connection.query(query, function (err, movies) {
            if (err) throw err;
            res.render('result', {movies: movies});
        });
    }
    if(type=="year") {
        query = "SELECT DISTINCT m.title, d.title_year, group_concat(g.genres Separator ', ') as genres, d.duration, d.country, d.actor_1_name, d.actor_2_name, " +
            "d.actor_3_name, d.movie_imdb_link, r.RottenTomatoes, r.Metacritic, r.IMDB, r.Fandango_Stars FROM " +
            "Movie m INNER JOIN movie_desc d ON m.imdbId = d.imdbId LEFT JOIN Movie_rate r ON m.imdbId = r.imdbId " +
            "INNER JOIN Genres g ON m.imdbId = g.imdbId WHERE d.title_year LIKE '%" + content + "%' group by m.title LIMIT 50";
        connection.query(query, function (err, movies) {
            if (err) throw err;
            res.render('result', {movies: movies});
        });
    }
    if(type=="genres") {
        query = "SELECT DISTINCT m.title, d.title_year, group_concat(g.genres Separator ', ') as genres, d.duration, d.country, d.actor_1_name, d.actor_2_name, " +
            "d.actor_3_name, d.movie_imdb_link, r.RottenTomatoes, r.Metacritic, r.IMDB, r.Fandango_Stars FROM " +
            "Movie m INNER JOIN movie_desc d ON m.imdbId = d.imdbId LEFT JOIN Movie_rate r ON m.imdbId = r.imdbId " +
            "INNER JOIN Genres g ON m.imdbId = g.imdbId WHERE g.genres LIKE '%" + content + "%' group by m.title LIMIT 50";
        connection.query(query, function (err, movies) {
            if (err) throw err;
            res.render('result', {movies: movies});
        });
    }
});


// api search result page
app.post("/apisearch", function (req, res) {
    var content = req.body.searchContent;
    console.log(content);
    // content = content.split("").join("''");
    var type = req.body.searchType;
    var url = "http://www.omdbapi.com/?i=tt3896198&apikey=b5cf18e9&t="+content;
    request(url,function (error, response, body) {
        console.log(JSON.parse(body));
        if (error) {
            throw error;
        } else {
            var data = JSON.parse(body);
            console.log(data);
            res.render('apisearch', {movie:data})
        }
    });
});


app.get("/movie", function(req, res) {
    res.render("movie");
});


// movie details
app.get('/movieDetails', function(req, res) {
    var mid = req.params.id;
    console.log(mid);
    res.render('movieDetails');
    // var query = "SELECT * FROM Movie WHERE imdbId = " + mid + "";
    // connection.query(query, function (err, movies) {
    //     if(err) throw err;
    //     console.log(query);
    //     var movie = movies[0]["title"];
    //     res.render('movieDetails', {movie : movie});
    // })
});


// ======== AUTH ROUT ===========
// app.get('/secret', function (req, res) {
//     res.render("secret");
// });


// register page
app.get('/register', function (req, res) {
    res.render("register");
});

// register logic
app.post('/register', function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        })
    })
});


// log in page
app.get('/login', function (req, res) {
    console.log("login");
    res.render("login");
});

// log in logic
// middleware
app.post('/login', passport.authenticate("local",
    {
        successRedirect : "/",
        failureRedirect : "/login"
    }) ,function (req, res) {
});


// log out
app.get('logout', function (req, res) {
    req.logout();
    res.redirect("/");
})

function isLoggedIn(res, req, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function() {
	console.log("MovieBook Server Start!");
})

// server.listen(app.get('port'), function(){
//     console.log('Express server listening on port ' + app.get('port'));
// });