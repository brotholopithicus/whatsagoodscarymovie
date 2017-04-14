const main = document.querySelector('.main-content');
let page = 1;
let skipCount = 0;
let movieMap = new Map();
let movieList = [];
let notInterested = new Map();
let alreadySeen = new Map();

function getMovies() {
    const URL = `https://api.themoviedb.org/3/discover/movie?api_key=d40153d3e4795486cd6f84905101bff3&language=en-US&sort_by=vote_average.desc&certification_country=US&include_adult=false&include_video=false&vote_count.gte=100&certification=R&with_genres=27&page=${page}`;
    get(URL).then(parseResponse).then(addToMovieList).then(chooseRandom).then(render);
}

function copyObject(obj) {
    let copy = Object.create(Object.getPrototypeOf(obj));
    let propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(name => {
        let desc = Object.getOwnPropertyDescriptor(obj, name);
        Object.defineProperty(copy, name, desc);
    });
    return copy;
}

function addToMovieList(movies) {
    movies.forEach(movie => {
        if (!movieMap.has(movie.title) && !notInterested.has(movie.title) && !alreadySeen.has(movie.title)) movieMap.set(movie.title, movie);
    });
    movieList = Array.from(movieMap.values());
    return movieList;
}

function parseResponse(res) {
    return JSON.parse(res).results;
}

function chooseRandom(movies) {
    return movies[Math.floor(Math.random() * movies.length)];
}

function createElement(selector, parent, options) {
    let el = document.createElement(selector);
    if (typeof options.id !== 'undefined') el.id = options.id;
    if (typeof options.classes !== 'undefined') options.classes.forEach(cl => el.classList.add(cl));
    if (typeof options.text !== 'undefined') el.textContent = options.text;
    if (typeof options.src !== 'undefined') el.src = options.src;
    if (typeof options.evtListener !== 'undefined') el.addEventListener(options.evtListener.evt, options.evtListener.handler);
    if (typeof options.data !== 'undefined') options.data.forEach(d => el.dataset[d.key] = d.value);
    parent.appendChild(el);
    return el;
}

function render(movie) {
    let el = createElement('div', main, { classes: ['movie-container'] });
    let img = createElement('img', el, { src: 'https://image.tmdb.org/t/p/w185' + movie.poster_path });
    let meta = createElement('div', el, { classes: ['meta'] });
    let title = createElement('h1', meta, { text: movie.title });
    let overview = createElement('p', meta, { text: movie.overview });
    let buttons = createElement('div', meta, { classes: ['button-group'], data: [{ key: 'title', value: movie.title }] });
    let b1 = createElement('button', buttons, { text: 'Already Seen', id: 'already-seen', evtListener: { evt: 'click', handler: buttonClickHandler } });
    let b2 = createElement('button', buttons, { text: 'Not Interested', id: 'not-interested', evtListener: { evt: 'click', handler: buttonClickHandler } });
}

getMovies();

function buttonClickHandler(e) {
    skipCount++;
    if (skipCount / movieList.length > 9.5) page++;
    console.log(skipCount / movieList.length);
    let title = e.target.parentNode.dataset.title;
    let movie = movieMap.get(title);
    switch (e.target.id) {
        case 'not-interested':
            notInterested.set(title, movie);
            movieMap.delete(title);
            break;
        case 'already-seen':
            alreadySeen.set(title, movie);
            movieMap.delete(title);
            break;
    }
    movieList = Array.from(movieMap.values());
    main.removeChild(document.querySelector('.movie-container'));
    getMovies();
}

function get(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function() { return reject(Error('Network Error')); };
        xhr.send();
    });
}
