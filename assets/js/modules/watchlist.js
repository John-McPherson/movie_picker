import {
    dataHandler
} from "./dataHandler.js";
import {
    filteredWatchlist
} from "./filters.js";
import {
    setActiveList
} from "./toggleList.js";

export var watchlist, sightandsound;
const output = document.querySelector('#output');

export async function popWatchList() {
    watchlist = await dataHandler(new Request(`./assets/json/movies.json`))
    sightandsound = await dataHandler(new Request(`./assets/json/sightandsound.json`))
    setActiveList(watchlist);
}

export function getMovie() {
    let index = getRandomIndex(filteredWatchlist.length);
    let movie = filteredWatchlist[index];
    displayMovie(movie);
}

function getRandomIndex(maxIndex) {
    return Math.floor(Math.random() * maxIndex);
}

function displayMovie(movie) {
    let posterURL;
    if (movie.poster_path) {
        posterURL = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + movie.poster_path;
    } else {
        posterURL = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
    }
    // let bgUrl = 'https://image.tmdb.org/t/p/original' + movie.backdrop_path;
    let html = `<img src="${posterURL}" alt="">
                <h2>${movie.title}</h2>`
    output.innerHTML = html;
    // output.style.backgroundImage = `url('${bgUrl}')`;

}
export default {
    watchlist,
    getMovie,
    sightandsound,
}