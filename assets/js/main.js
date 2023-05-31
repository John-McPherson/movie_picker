import {
    auth,
    createSession
} from "./modules/auth.js";
import {
    popWatchList,
    getMovie
} from "./modules/watchlist.js";
import {
    filterRuntime,
    setupFilters
} from "./modules/filters.js";

// dom elements
const loginBtn = document.querySelector('.login-btn');
const movieBtn = document.querySelector('.movie-btn');

// event listners
loginBtn.addEventListener('click', auth)
movieBtn.addEventListener('click', getMovie)

// functions
async function run() {
    await createSession();
    await popWatchList();
    await setupFilters()
}

// on load
window.onload = () => {
    run();
};