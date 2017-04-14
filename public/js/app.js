const img = document.querySelector('.poster');
const title = document.querySelector('.title');
const overview = document.querySelector('.overview');
const nextButton = document.querySelector('.next-button');
nextButton.addEventListener('click', handleNextClick);

function handleNextClick() {
    getMovie();
}

const img_path = 'https://image.tmdb.org/t/p/w185';
let count = 0;

async function getMovie() {
    const movie = await get(`/api/movies/${count}`).then(JSON.parse);
    console.log(movie);
    displayMovie(movie);
    count++;
}

function displayMovie(movie) {
    img.src = img_path + movie.poster_path;
    title.textContent = movie.title;
    overview.textContent = movie.overview;
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
window.onload = () => getMovie();
