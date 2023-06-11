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
        console.log('1')
        data = await getRunTimes(data.items)
    } else {
        console.log('2')
        data = await getRunTimes(data.results);
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


async function getRunTimes(movies) {
    return await Promise.all(movies.map(async (movie) => {
        const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
        let data = await dataHandler(movieUrl);
        return data;
    }));
}

export default {
    auth,
    createSession
};