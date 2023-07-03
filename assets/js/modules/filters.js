import {
    activeList
} from "./toggleList.js"


// vars 
export var filteredWatchlist;
var minRuntime, maxRuntime, genres, checkboxes, serviceCheckboxes, filteredServices = [];
const services = ['BFI Player Amazon Channel', 'Netflix', 'Amazon Prime Video', 'ITVX', 'Disney Plus'];

// dom elements

const runtimeSlider = document.querySelector("#runtime-slider");
const attachedElement = document.getElementById('attachedElement');
const movieCount = document.querySelector('#movie_count')
const form = document.querySelector('#streaming-services');
const genreForm = document.querySelector('#genres');


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
    setupData()
    setUpStreamingService()
    // checkboxes = [...populateCheckboxes(services, form), ...populateCheckboxes(genres, genreForm)]

    // setupEventlistners();

}

function handleChange(event) {
    let value = event.target.value;
    filteredWatchlist = filterRuntime(value, activeList);
    countMovies();
    const percentage = ((value - minRuntime) / (maxRuntime - minRuntime)) * 100;
    const sliderWidth = event.target.offsetWidth;
    const thumbWidth = event.target.offsetHeight;
    const attachedElementWidth = attachedElement.offsetWidth;

    const maxPosition = sliderWidth - thumbWidth;
    const position = (percentage / 100) * maxPosition - (attachedElementWidth / 2);

    attachedElement.style.left = `${position}px`;
    attachedElement.textContent = value;
    setupData()


}
// event listners

function countMovies() {
    movieCount.innerText = filteredWatchlist.length;
}



/**
 * Get unique values for the specified key from the filtered watchlist.
 * @param {string} key - The key to extract unique values from. Should either be "genres" or "services"
 * @returns {Array} - An array of unique values for the specified key.
 */
function getdata(key) {
    return [...new Set(filteredWatchlist.flatMap(movie => movie[key]))];
}

function setupData() {
    genres = getdata('genres');
    countMovies();

}

function setUpStreamingService() {

    let curServices = getdata('services');
    let html = services.filter(service => curServices.includes(service))
        .map(service => (
            `<span> <input type="checkbox" id="${service}" name="checkboxes" value="${service}">
                    <label for="${service}">${service}</label></span>`
        ))

    form.innerHTML = html.join('');
    serviceCheckboxes = form.querySelectorAll('input[type="checkbox"]');
    runtimeSlider.addEventListener('change', handleChange);
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}

function populateCheckboxes(arr, target) {
    // console.log(target.data())
    const html = arr.filter(elm => getdata(target.getAttribute('data-type'))).map(elm => (
        `<span> <input type="checkbox" id="${elm}" name="checkboxes" value="${elm}">
                    <label for="${elm}">${elm}</label></span>`
    ))
    target.innerHTML = html.join('');

    return target.querySelectorAll('input[type="checkbox"]')


}

function setupEventlistners() {
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}


export function filterByService(list) {
    if (filteredServices) {
        return list.filter(movie => movie.services.some(elm => filteredServices.includes(elm)));
    }
    return list;
}



function handleCheckboxChange() {
    filteredServices = Array.from(serviceCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    if (filteredServices.length) {
        filteredWatchlist = filterByService(activeList)
    } else {
        filteredWatchlist = activeList
    }
    countMovies();
}




export default {
    filterRuntime,
    setupFilters,
    filteredWatchlist,
    filterByService

}