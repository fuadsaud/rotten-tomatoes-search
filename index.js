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

app.listen(7000);
