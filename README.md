# Rotten Tomatoes Search Server

HTTP JSON API for to return movie data from [Rotten Tomatoes](//rottentomatoes.com).

## Installing dependencies

Make sure node and npm are installed.

To install all npm package dependencies:

```shell
npm install
```

Make sure the MongoDB server is running before starting the server.

To start the server:

```shell
node index.js
```

This will boot the application and bind it to port 7000.

## Endpoints

The endpoints available are:

### GET /movies

Search movies by title. The search term is defined by te supplied `q`
parameter. If the parameter `q` is not supplied an empty set will be returned.

Example:

`GET /movies?q=cinderella`

```json
{
  "movies": [
    {
      "poster": "http://resizing.flixster.com/YKGbQ15uM3ETr8gBGCoO0g4ML0Y=/54x80/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/15/11181570_ori.jpg",
      "audience_rating": "Upright",
      "audience_score": 87,
      "critics_rating": "Certified Fresh",
      "critics_score": 84,
      "comments": [],
      "_id": "550cb39f9300a7ae006e94a3",
      "id": "771270966",
      "title": "Cinderella",
      "year": 2015,
      "mpaa_rating": "PG",
      "runtime": 105,
      "critics_consensus": "",
      "release_dates": {
        "theater": "2015-03-13"
      },
      "synopsis": "Cate Blanchett stars in this new vision of the Cinderella tale from director Kenneth Branagh and the screenwriting team of Chris Weitz and Aline Brosh McKenna for Disney Pictures. ~ Jeremy Wheeler, Rovi",
      "alternate_ids": {
        "imdb": "1661199"
      },
      "links": {
        "alternate": "http://www.rottentomatoes.com/m/cinderella_2013/",
        "cast": "http://api.rottentomatoes.com/api/public/v1.0/movies/771270966/cast.json",
        "reviews": "http://api.rottentomatoes.com/api/public/v1.0/movies/771270966/reviews.json",
        "similar": "http://api.rottentomatoes.com/api/public/v1.0/movies/771270966/similar.json",
        "self": "http://api.rottentomatoes.com/api/public/v1.0/movies/771270966.json"
      }
    }
  ]
}

```

### GET /movies/:movie_id

Get details for the movie with the given id.

Example:

`GET /movies/771312088`

```json
{
  "movie": {
    "poster": "http://resizing.flixster.com/o5LFh1rOsPGEtzQEDloy-4HQsjE=/54x81/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/98/11189899_ori.jpg",
    "audience_score": 74,
    "critics_rating": "Fresh",
    "critics_score": 65,
    "audience_rating": "Upright",
    "comments": [],
    "_id": "550cb39f9300a7ae006e94c6",
    "id": "771312088",
    "title": "The Hunger Games: Mockingjay - Part 1",
    "year": 2014,
    "mpaa_rating": "PG-13",
    "runtime": 125,
    "critics_consensus": "",
    "release_dates": {
      "theater": "2014-11-21",
      "dvd": "2015-03-06"
    },
    "synopsis": "The worldwide phenomenon of The Hunger Games continues to set the world on fire with The Hunger Games: Mockingjay - Part 1, which finds Katniss Everdeen (Jennifer Lawrence) in District 13 after she literally shatters the games forever. Under the leadership of President Coin (Julianne Moore) and the advice of her trusted friends, Katniss spreads her wings as she fights to save Peeta (Josh Hutcherson) and a nation moved by her courage. The Hunger Games: Mockingjay - Part 1 is directed by Francis Lawrence from a screenplay by Danny Strong and Peter Craig and produced by Nina Jacobson's Color Force in tandem with producer Jon Kilik. The novel on which the film is based is the third in a trilogy written by Suzanne Collins that has over 65 million copies in print in the U.S. alone. (c) Lionsgate",
    "alternate_ids": {
      "imdb": "1951265"
    },
    "links": {
      "self": "http://api.rottentomatoes.com/api/public/v1.0/movies/771312088.json",
      "alternate": "http://www.rottentomatoes.com/m/the_hunger_games_mockingjay_part_1/",
      "cast": "http://api.rottentomatoes.com/api/public/v1.0/movies/771312088/cast.json",
      "reviews": "http://api.rottentomatoes.com/api/public/v1.0/movies/771312088/reviews.json",
      "similar": "http://api.rottentomatoes.com/api/public/v1.0/movies/771312088/similar.json"
    }
  }
}

```

### PUT /movies/:movie_id

Update the movie document represented by the provided id.

The only field accepted for updating the document is the embedded comments
collection. Comment objects without and `id` field will be added to the movie
document. The response will include, embedded, the newly created comments with
the id's that were just assigned.

Example:

```JSON

PUT /movies/771312088

{
  "movie": {
    "comments": [
      {
        "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod\ntempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At\nvero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,\nno sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "author": "Fuad Saud",
        "movie": "771312088"
      }
    ]
  }
}
```

```json

{
  "movie": {
    "poster": "http://resizing.flixster.com/o5LFh1rOsPGEtzQEDloy-4HQsjE=/54x81/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/98/11189899_ori.jpg",
    "audience_score": 74,
    "critics_rating": "Fresh",
    "critics_score": 65,
    "audience_rating": "Upright",
    "comments": [
      {
        "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod\ntempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At\nvero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,\nno sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "author": "Fuad Saud",
        "movie": "771312088",
        "id": "5517cde8dbbc18cc71b22634"
      }
    ],
    "_id": "550cb39f9300a7ae006e94c6",
    "id": "771312088",
    "title": "The Hunger Games: Mockingjay - Part 1",
    "year": 2014,
    "mpaa_rating": "PG-13",
    "runtime": 125,
    "critics_consensus": "",
    "release_dates": {
      "theater": "2014-11-21",
      "dvd": "2015-03-06"
    },
    "synopsis": "The worldwide phenomenon of The Hunger Games continues to set the world on fire with The Hunger Games: Mockingjay - Part 1, which finds Katniss Everdeen (Jennifer Lawrence) in District 13 after she literally shatters the games forever. Under the leadership of President Coin (Julianne Moore) and the advice of her trusted friends, Katniss spreads her wings as she fights to save Peeta (Josh Hutcherson) and a nation moved by her courage. The Hunger Games: Mockingjay - Part 1 is directed by Francis Lawrence from a screenplay by Danny Strong and Peter Craig and produced by Nina Jacobson's Color Force in tandem with producer Jon Kilik. The novel on which the film is based is the third in a trilogy written by Suzanne Collins that has over 65 million copies in print in the U.S. alone. (c) Lionsgate",
    "alternate_ids": {
      "imdb": "1951265"
    },
    "links": {
      "self": "http://api.rottentomatoes.com/api/public/v1.0/movies/771312088.json",
      "alternate": "http://www.rottentomatoes.com/m/the_hunger_games_mockingjay_part_1/",
      "cast": "http://api.rottentomatoes.com/api/public/v1.0/movies/771312088/cast.json",
      "reviews": "http://api.rottentomatoes.com/api/public/v1.0/movies/771312088/reviews.json",
      "similar": "http://api.rottentomatoes.com/api/public/v1.0/movies/771312088/similar.json"
    }
  }
}

```
