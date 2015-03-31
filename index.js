const express     = require('express')
const morgan      = require('morgan')
const bodyParser  = require('body-parser')
const cors        = require('cors')
const MongoClient = require('mongodb').MongoClient
const ObjectId    = require('mongodb').ObjectId
const R           = require('ramda')

const app = express()

var db

const RT = {
    serializeMovie: function (doc) {
      return R.pipe(
        R.merge({ comments: [] }),
        R.dissoc('abridged_cast'),
        R.dissoc('ratings'),
        R.dissoc('posters'),
        R.merge(doc.ratings),
        R.merge({ poster: doc.posters.thumbnail }))(doc)
    },
    searchRegExp: function (query) {
      const matches = query.replace(/\W+/, ' ').split(' ')

      const keywords = R.reduce(function (keywords, match) {
        return keywords + "|" + match

      }, matches[0], R.tail(matches))

      return new RegExp("\\b" + keywords, 'i')
    },
    logger: {
      logError: function (msg) { this.log('[ERROR] ' + msg) },
      logInfo:  function (msg) { this.log('[INFO] ' + msg) },
      log: console.log
    }
}

const mongoURL = process.env.MONGOLAB_URI || 'mongodb://localhost/rottentomatoes'

MongoClient.connect(mongoURL, function (err, database) {
  if (err) {
    RT.logger.logError('Could not establish a connection to the mongodb server.')

    return
  }

  RT.logger.logInfo('Connection to mongodb server was succesfully stablished.')

  db = database

  const port = process.env.PORT || 7000

  RT.logger.logInfo('Starting up HTTP server listening on port ' + port)

  app.listen(port)
})


app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

app.get('/movies', function (req, res) {
  const query = req.query.q

  if (!query) {
    res.json({ movies: [] })

    return
  }

  const movies = db.collection('movies')

  movies.find({ title: RT.searchRegExp(query) }).toArray(function (err, docs) {
    if (err) {
      res.status(500).send('There was an error while talking to the mongodb server')

      return
    }

    res.json({ movies: R.map(RT.serializeMovie, docs) })
  })
})

app.get('/movies/:movie_id', function (req, res) {
  const movieId = req.params.movie_id

  const movies = db.collection('movies')

  movies.findOne({ id: movieId }, { limit: 1 }, function (err, doc) {
    if (err) {
      res.status(500).send('There was an error while talking to the mongodb server')

      return
    }

    if (doc)
      res.json({ movie: RT.serializeMovie(doc) })
    else
      res.status(404).send('Not found.')
  })
})

app.put('/movies/:movie_id', function (req, res) {
  const movieId = req.params.movie_id
  const comments = req.body.movie.comments || []

  const commentsWithoutId = R.filter(function (c) { return !c.id }, comments)

  const newComments = R.map(function (c) {
    return R.merge(c, { id: new ObjectId() })
  }, commentsWithoutId)

  const movies = db.collection('movies')

  movies.findOneAndUpdate(
    { id: movieId },
    { $push: { comments: { $each: newComments } } },
    { returnOriginal: false }, function (err, result) {
      if (err) {
        res.status(500).send('There was an error while talking to the mongodb server')

        return
      }

      if (result.value)
        res.json({ movie: RT.serializeMovie(result.value) })
      else
        res.status(404).send('Not found.')
    })
})
