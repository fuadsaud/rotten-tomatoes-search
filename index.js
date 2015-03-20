const express = require('express');
const morgan  = require('morgan');
const mongo   = require('mongodb').MongoClient;
const R       = require('ramda');

const app = express();

var db;

const rt = {
    normalizeDoc: function(doc) {
        return R.mergeAll([doc, doc.ratings, { poster: doc.posters.thumbnail }]);
    },
    logger: {
        logError: function(msg) { this.log('[ERROR] ' + msg) },
        logInfo:  function(msg) { this.log('[INFO] ' + msg) },
        log: console.log
    }

}

const mongoURL = 'mongodb://localhost/rottentomatoes';

mongo.connect(mongoURL, function(err, database) {
    if (err) {
        rt.logger.logError('Could not establish a connection to the mongodb server.');

        return;
    }

    rt.logger.logInfo('Connection to mongodb server was succesfully stablished.');

    db = database;

    app.listen(7000);
});


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

    const movies = db.collection('movies');

    movies.find({ title: new RegExp(query, 'i') }).toArray(function(err, docs) {
        if (err) {
            res.status(500).send('There was an error while talking to the mongodb server');

            return;
        }

        res.json({ movies: _.map(docs, rt.normalizeDoc) });

        db.close();
    });
});

app.get('/movies/:movie_id', function(req, res) {
    const movieId = req.params.movie_id;

    const movies = db.collection('movies');

    movies.findOne({ id: movieId }, { limit: 1 }, function(err, doc) {
        if (err) {
            res.status(500).send('There was an error while talking to the mongodb server');

            return;
        }

        if (doc)
            res.json({ movie: rt.normalizeDoc(doc) });
        else
            res.status(404).send('Not found.');
    });
});

app.put('/movies/:movie_id', function(req, res) {
    const movieId = req.params.movie_id;

    const movies = db.collection('movies');

    collection.update({ id: movieId }, { $set: { comment: 'abcdefg' } }, function(err, result) {
        if (err) {
            res.status(500).send('There was an error while talking to the mongodb server');

            return;
        }

        if (result.result.n === 1)
            res.json({ movie: doc });
        else if (result.result.n === 0)
            res.status(404).send('Not found.');

        db.close();
    });
});
