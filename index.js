const express = require('express');
const morgan  = require('morgan');
const mongo   = require('mongodb').MongoClient;

const mongoURL = 'mongodb://localhost/rottentomatoes';

const app = express();

app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/movies', function(req, res) {
    const query = req.query.q;

    if (!query) {
        res.json({ movies: [] });

        return;
    }

    mongo.connect(mongoURL, function(err, db) {
        if (err) console.log(err);

        const movies = db.collection('movies');

        movies.find({ title: new RegExp(query, 'i') }).toArray(function(err, docs) {
            res.json({ movies: docs });

            db.close();
        });
    });
});

app.get('/movies/:movie_id', function(req, res) {
    const movieId = req.params.movie_id;

    mongo.connect(mongoURL, function(err, db) {
        if (err) console.log(err);

        const movies = db.collection('movies');

        movies.findOne({ id: movieId }, { limit: 1 }, function(err, doc) {
            if (doc)
                res.json({ movie: doc });
            else
                res.status(404).send('Not found.');

            db.close();
        });
    });
});

app.listen(7000);
