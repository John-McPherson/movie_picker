import {
    setupFilters
} from "./filters.js";

import {
    sightandsound,
    watchlist
} from "./watchlist.js";

export var activeList;

export function setActiveList(list) {
    return activeList = list;
}

export async function toggleList(e) {
    let list;
    let sAndS = e.target.checked;
    if (sAndS) {
        list = sightandsound
    } else {
        list = watchlist
    }
    console.log(list)
    await setActiveList(list)
    setupFilters(list)
}

export default {
    toggleList,
    setActiveList,
    activeList
}