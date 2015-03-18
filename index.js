const express = require('express');
const morgan  = require('morgan');
const mongo   = require('mongodb').MongoClient;
const _       = require('lodash');

const mongoURL = 'mongodb://localhost/rottentomatoes';

const app = express();

const rt = {
    normalizeDoc: function(doc) {
        return _.assign(doc, { poster: doc.posters.thumbnail });
    }
}

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
            res.json({ movies: _.map(docs, rt.normalizeDoc) });

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
                res.json({ movie: rt.normalizeDoc(doc) });
            else
                res.status(404).send('Not found.');

            db.close();
        });
    });
});

app.put('/movies/:movie_id', function(req, res) {
    const movieId = req.params.movie_id;

    mongo.connect(mongoURL, function(err, db) {
        if (err) console.log(err);

        const movies = db.collection('movies');

        collection.update({ id: movieId }, { $set: { comment: 'abcdefg' } }, function(err, result) {
            if (result.result.n === 1)
                res.json({ movie: doc });
            else if (result.result.n === 0)
                res.status(404).send('Not found.');

            db.close();
        });
    });
});

app.listen(7000);
