import {
    auth,
    createSession
} from "./modules/auth.js";
import {
    popWatchList,
    getMovie,
    watchlist
} from "./modules/watchlist.js";
import {
    filterRuntime,
    setupFilters
} from "./modules/filters.js";

import {
    toggleList
} from "./modules/toggleList.js";

// dom elements
const loginBtn = document.querySelector('.login-btn');
const movieBtn = document.querySelector('.movie-btn');
const toggle = document.querySelector('#list-toggle');

// event listners
loginBtn.addEventListener('click', auth)
movieBtn.addEventListener('click', getMovie)
toggle.addEventListener('change', toggleList)


// functions
async function run() {
    await createSession();
    await popWatchList();
    console.log(watchlist)
    await setupFilters(watchlist)

}

// on load
window.onload = () => {
    run();
};