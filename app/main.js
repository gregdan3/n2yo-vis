var year = 2021;
var satdata = {};
var orbitStat = "Apogee";

d3.json("static/n2yo.json").then(function (data) {
  Object.entries(data).forEach(([k, v], i) => {
    v.forEach((sat) => {
      sat["Launch date"] = n2yoDatetoDate(sat["Launch date"]);
      sat["Decay date"] = sat["Decay date"]
        ? n2yoDatetoDate(sat["Decay date"])
        : "";
      sat.Apogee = parseFloat(sat.Apogee);
      sat.Perigee = parseFloat(sat.Perigee);
    });
  });
  satdata = data;
  // var init_s_val = d3.select("input").attr("value");
  init_render(year, satdata, orbitStat);
});

function debounced(delay, fn) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

function change_slider(value) {
  year = parseInt(value);
  render_graph(year, satdata, orbitStat);
}

function changeOrbitStat(checked) {
  if (checked) {
    orbitStat = "Perigee";
  } else {
    orbitStat = "Apogee";
  }
  document.querySelector(
    "label[for=checkbox"
  ).innerHTML = `Graphing ${orbitStat}`; // look
  render_graph(year, satdata, orbitStat);
}
