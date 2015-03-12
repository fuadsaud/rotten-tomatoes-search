const express = require('express');
const mongo   = require('mongodb').MongoClient;

const mongoURL = 'mongodb://localhost/rottentomatoes';

const app = express();

app.get('/movies/search', function(req, res) {
    const query = req.query.q;

    mongo.connect(mongoURL, function(err, db) {
        if (err) console.log(err);

        const movies = db.collection('movies');

        movies.find({ title: new RegExp(query, 'i') }).toArray(function(err, docs) {
            res.json(docs);

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
                res.json(doc);
            else
                res.status(404).send('Not found.');

            db.close();
        });
    });
});

app.listen(7000);
