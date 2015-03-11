const express = require('express');

const app = express();

app.get('/movies', function(req, res) {
    res.json([{ id: 1, title: 'Hey there!' }]);
});

app.listen(7000);
