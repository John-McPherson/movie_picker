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
        let watchListData = await dataHandler(watchlistUrl)
        watchListData = await getRunTimes(watchListData.results);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(watchListData),
        };
        await dataHandler(new Request(`./assets/phpscripts/updatedata.php`), requestOptions);
        return popWatchList();
    } else {
        return false;
    }
}


async function getRunTimes(movies) {
    return await Promise.all(movies.map(async (movie) => {
        const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
        let data = await dataHandler(movieUrl);
        console.log(data);
        return data;
    }));
}

export default {
    auth,
    createSession
};