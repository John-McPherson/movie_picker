import {
    watchlist
} from "./watchlist.js"


// vars 
export var filteredWatchlist;
var minRuntime, maxRuntime;

// dom elements

const runtimeSlider = document.querySelector("#runtime-slider");
const attachedElement = document.getElementById('attachedElement');

export function filterRuntime(time) {

    filteredWatchlist = watchlist.filter(movie => {

        return movie.runtime <= time;
    })
}

function minMaxRuntimes(data) {

    let maxRuntime = data[0];
    let minRuntime = data[0];

    data.forEach(movie => {
        if (movie.runtime > maxRuntime.runtime) {
            maxRuntime = movie.runtime;
        }
        if (movie.runtime < minRuntime.runtime) {
            minRuntime = movie.runtime;
        }
    });

    return {
        maxRuntime,
        minRuntime
    };

}

export function setupFilters() {
    ({
        maxRuntime,
        minRuntime
    } = minMaxRuntimes(watchlist));
    runtimeSlider.max = maxRuntime;
    runtimeSlider.min = minRuntime;
    runtimeSlider.value = maxRuntime;
    filteredWatchlist = watchlist;
}

function handleChange(event) {
    let value = event.target.value;
    filterRuntime(value);
    const percentage = ((value - minRuntime) / (maxRuntime - minRuntime)) * 100;
    const sliderWidth = event.target.offsetWidth;
    const thumbWidth = event.target.offsetHeight;
    const attachedElementWidth = attachedElement.offsetWidth;

    const maxPosition = sliderWidth - thumbWidth;
    const position = (percentage / 100) * maxPosition - (attachedElementWidth / 2);

    attachedElement.style.left = `${position}px`;
    attachedElement.textContent = value;
}
// event listners
runtimeSlider.addEventListener('change', handleChange)


export default {
    filterRuntime,
    setupFilters,
    filteredWatchlist

}