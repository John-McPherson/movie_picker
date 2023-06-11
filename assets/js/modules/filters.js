import {
    activeList
} from "./toggleList.js"


// vars 
export var filteredWatchlist;
var minRuntime, maxRuntime;

// dom elements

const runtimeSlider = document.querySelector("#runtime-slider");
const attachedElement = document.getElementById('attachedElement');

export function filterRuntime(time, list) {

    return list.filter(movie => {
        return movie.runtime <= time;
    })
}

function minMaxRuntimes(data) {

    let maxRuntime = data[0].runtime;
    let minRuntime = data[0].runtime;

    data.forEach(movie => {

        if (movie.runtime > maxRuntime) {
            maxRuntime = movie.runtime;

        }
        if (movie.runtime < minRuntime) {
            minRuntime = movie.runtime;
        }
    });

    return {
        maxRuntime,
        minRuntime
    };

}

export function setupFilters(list) {
    ({
        maxRuntime,
        minRuntime
    } = minMaxRuntimes(list));
    runtimeSlider.max = maxRuntime;
    runtimeSlider.min = minRuntime;
    runtimeSlider.value = maxRuntime;
    filteredWatchlist = list;

}

function handleChange(event) {
    let value = event.target.value;
    filteredWatchlist = filterRuntime(value, activeList);
    const percentage = ((value - minRuntime) / (maxRuntime - minRuntime)) * 100;
    const sliderWidth = event.target.offsetWidth;
    const thumbWidth = event.target.offsetHeight;
    const attachedElementWidth = attachedElement.offsetWidth;

    const maxPosition = sliderWidth - thumbWidth;
    const position = (percentage / 100) * maxPosition - (attachedElementWidth / 2);

    attachedElement.style.left = `${position}px`;
    attachedElement.textContent = value;
    console.log(filteredWatchlist)
    console.log(minRuntime)
}
// event listners
runtimeSlider.addEventListener('change', handleChange)


export default {
    filterRuntime,
    setupFilters,
    filteredWatchlist

}