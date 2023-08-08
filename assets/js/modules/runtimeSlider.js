import { activeList } from "./toggleList.js";
import { filterRuntime, filteredWatchlist } from "./filters.js";

var maxRuntime, minRuntime, runtimeSlider;
const labels = document.querySelectorAll(".slide_label");
function minMaxRuntimes(data) {
	let maxRuntime = data[0].runtime;
	let minRuntime = data[0].runtime;

	data.forEach((movie) => {
		if (movie.runtime > maxRuntime) {
			maxRuntime = movie.runtime;
		}
		if (movie.runtime < minRuntime) {
			minRuntime = movie.runtime;
		}
	});

	return {
		maxRuntime,
		minRuntime,
	};
}

export function updateRuntimes() {
	({ maxRuntime, minRuntime } = minMaxRuntimes(activeList));
	if (runtimeSlider) {
		runtimeSlider.slider("option", "min", minRuntime);
		runtimeSlider.slider("option", "max", maxRuntime);
		runtimeSlider.slider("option", "values", [minRuntime, maxRuntime]);
		labels[0].textContent = minRuntime;
		labels[1].textContent = maxRuntime;
	}
}

export function initSlider() {
	updateRuntimes();

	runtimeSlider = $("#runtime_slider").slider({
		animate: "fast",
		min: minRuntime,
		max: maxRuntime,
		range: true,
		values: [minRuntime, maxRuntime],
		slide: function (event, elm) {
			filterRuntime(elm.values[0], elm.values[1], activeList);
			labels.forEach((element, index) => {
				console.log(element);
				element.textContent = elm.values[index];
			});
		},
	});
}

export default {
	initSlider,
	updateRuntimes,
};
