var year = 2020;
var satdata = {};

d3.json("static/n2yo.json").then(function (data) {
  Object.entries(data).forEach(([k, v], i) => {
    v.forEach((sat) => {
      sat["Launch date"] = n2yoDatetoDate(sat["Launch date"]);
      sat["Decay date"] = sat["Decay date"]
        ? n2yoDatetoDate(sat["Decay date"])
        : "";
      sat.Apogee = parseFloat(sat.Apogee);
      sat.Perigee = parseFloat(sat.Perigee);
      if (sat["Decay date"]) {
        if (sat["Info"]) {
          sat["Info"] += "\n\nThis object's orbit has decayed.\n";
        } else {
          sat["Info"] = "This object's orbit has decayed.\n";
        } // NOTE: NORAD 45610 has NO decay date. bruh.
      }
    });
  });
  satdata = data;
  // var init_s_val = d3.select("input").attr("value");
  init_render(year, satdata);
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
  render_graph(year, satdata);
}
