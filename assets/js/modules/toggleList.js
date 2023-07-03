import {
    setupFilters,
    filterByService
} from "./filters.js";

import {
    sightandsound,
    watchlist
} from "./watchlist.js";

export var activeList;

export function setActiveList(list) {
    activeList = list;
    setupFilters(list)

    return activeList;
}

export async function toggleList(e) {
    let list;
    let sAndS = e.target.checked;
    if (sAndS) {
        list = sightandsound
    } else {
        list = watchlist
    }
    // console.log(list)
    let newList = await setActiveList(list)
    setupFilters(newList)
}

export default {
    toggleList,
    setActiveList,
    activeList
}