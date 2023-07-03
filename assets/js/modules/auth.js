import {
    dataHandler
} from "./dataHandler.js";
import {
    popWatchList
} from "./watchlist.js";

const redirectURL = "http://localhost:3000/index.html";

var apiKey, accountId;


async function getSecrets() {
    let data = await dataHandler(new Request(`./assets/phpscripts/setup.php`, ));
    apiKey = data.TMDB_API;
    accountId = data.TMDB_ID;
}

export async function auth() {
    await getSecrets();
    let requestToken = await dataHandler(new Request(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`))
    let authenticateUrl = ` https://www.themoviedb.org/authenticate/${requestToken.request_token}?redirect_to=${encodeURIComponent(redirectURL)}`
    window.location.href = authenticateUrl;
}

export async function createSession() {
    await getSecrets();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (!urlParams.get('request_token')) {
        return false;
    }
    const sessionCreationUrl = `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`;
    const requestData = {
        request_token: urlParams.get('request_token') // Replace with the request token obtained from the authentication process
    };
    const requestHeaders = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(requestData)
    }
    let session = await dataHandler(sessionCreationUrl, requestHeaders)
    if (session.success) {
        const watchlistUrl = `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?api_key=${apiKey}&session_id=${session.session_id}`
        const sightandsoundUrl = `https://api.themoviedb.org/3/list/8255505?api_key=${apiKey}`;
        let watchListOptions = await prepRequest(watchlistUrl);
        let sightandsoundOptions = await prepRequest(sightandsoundUrl);

        await dataHandler(new Request(`./assets/phpscripts/updatedata.php?fileName=movies`), watchListOptions);
        await dataHandler(new Request(`./assets/phpscripts/updatedata.php?fileName=sightandsound`), sightandsoundOptions);

        return popWatchList();
    } else {
        window.location.href = window.location.href.split('?')[0];
        return false;
    }
}

async function prepRequest(url) {

    let data = await dataHandler(url);

    if (data.items) {
        console.log(data)
        data = await getRunTimes(data.items)
    } else {
        data = await getFullWatchList(data, url);
        data = await getRunTimes(data);
        console.log(data)
    }

    let requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    return requestOptions;
}


async function getFullWatchList(data, url) {
    let totalPages = data.total_pages;
    let page = 2;
    let movies = data.results;

    while (page <= totalPages) {
        const newData = await dataHandler(url + '&page=' + page);
        movies = movies.concat(newData.results);
        page++;
    }

    return movies;
}

async function getRunTimes(movies) {
    return await Promise.all(movies.map(async (movie) => {
        const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
        const data = await dataHandler(movieUrl);
        return {
            "title": data.title,
            "runtime": data.runtime,
            "poster_path": data.poster_path,
            "genres": await populateGenres(data.genres),
            "services": await populateStreaming(data.id)
        }
    }));
}

function populateGenres(data) {
    return data.map(genre => genre.name)
}


async function populateStreaming(movieID) {
    const streamingServices = await dataHandler(`https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${apiKey}&watch_region=GB&watch_monetization_types=flatrate`);
    if (!streamingServices.results || !streamingServices.results.GB || !streamingServices.results.GB.flatrate) {
        return [];
    }
    return streamingServices.results.GB.flatrate.map(service => service.provider_name);
}


export default {
    auth,
    createSession
};