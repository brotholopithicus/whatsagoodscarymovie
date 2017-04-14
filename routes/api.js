var express = require('express');
var router = express.Router();

const url = 'https://api.themoviedb.org/3/discover/movie?api_key=d40153d3e4795486cd6f84905101bff3&language=en-US&sort_by=vote_average.desc&certification_country=US&include_adult=false&include_video=false&vote_count.gte=100&certification=R&with_genres=27&page=1';

router.get('/movies', async(req, res, next) => {
    const movies = await requestify(url).then(JSON.parse);
    res.json(movies.results);
});

router.get('/movies/:id', async(req, res, next) => {
    const movies = await requestify(url).then(JSON.parse);
    res.json(movies.results[parseInt(req.params.id)]);
});

const img_path = 'https://image.tmdb.org/t/p/w185';

function requestify(config, data) {
    if (typeof config === 'string') config = require('url').parse(config);
    return new Promise((resolve, reject) => {
        const protocol = config.protocol === 'https:' ? require('https') : require('http');
        const req = protocol.request(config, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) return reject(new Error(`Request Failed: StatusCode = ${res.statusCode}`));
            const body = [];
            res.on('data', (chunk) => body.push(chunk));
            res.on('end', () => resolve(body.join('')));
        });
        req.on('error', (err) => reject(err));
        if (data) req.write(data);
        req.end();
    });
}

module.exports = router;
