const transitionDuration = 750;
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const margin = {
  top: 75,
  right: 75,
  bottom: 75,
  left: 75,
};
const actual_width = 1900;
const width = actual_width - margin.left - margin.right;
const actual_height = 1900;
const height = actual_height - margin.top - margin.bottom;

// Might delete later
const outerRadius = Math.min(width, height) / 2;
const innerRadius = outerRadius / 3;

const classifications = [
  "Space & Earth Science",
  "Weather",
  "Navy Navigation Satellite System",
  "Experimental",
  "Military",
  "Amateur radio",
  "Geostationary",
  "Westford Needles",
  "Brightest",
  "Engineering",
  "Radar Calibration",
  "Intelsat",
  "Strela",
  "Tsiklon",
  "Geodetic",
  "Tselina",
  "NOAA",
  "Earth resources",
  "Raduga",
  "Molniya",
  "Parus",
  "GOES",
  "Tsikada",
  "Global Positioning System (GPS) Constellation",
  "Gorizont",
  "TV",
  "Russian LEO Navigation",
  "Glonass Constellation",
  "Tracking and Data Relay Satellite System",
  "ISS",
  "Orbcomm",
  "Gonets",
  "Satellite-Based Augmentation System",
  "Celestis",
  "Search & rescue",
  "Iridium",
  "Global Positioning System (GPS) Operational",
  "Globalstar",
  "Education",
  "CubeSats",
  "Flock",
  "Lemur",
  "XM and Sirius",
  "Beidou Navigation System",
  "Disaster monitoring",
  "Yaogan",
  "Glonass Operational",
  "OneWeb",
  "QZSS",
  "Galileo",
  "O3B Networks",
  "IRNSS",
  "Starlink",
];
const color = d3.scaleOrdinal(d3.schemeTableau10).domain(classifications);

// Build Day Numbers
function padDate(n) {
  return n < 10 ? "0" + n : n;
}

Date.prototype.getDOY = function () {
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = this.getMonth();
  var dn = this.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if (mn > 1 && this.isLeapYear()) dayOfYear++;
  return dayOfYear;
};

function n2yoDatetoDate(n2yoDate) {
  return new Date(n2yoDate);
}

function makeCalDate(date) {
  return `${padDate(date.getDate())} ${days[date.getDay()]}`;
}

function getDatesOfYear(year) {
  let end = new Date(year + 1, 0, 1);
  let daysOfYear = [];
  for (var d = new Date(year, 0, 1); d < end; d.setDate(d.getDate() + 1)) {
    daysOfYear.push(new Date(d));
  }
  return daysOfYear;
}

function generateXScale(year) {
  return d3
    .scaleBand()
    .domain(getDatesOfYear(year))
    .range([0, 2 * Math.PI])
    .align(0);
}

function generateYScale(data) {
  return d3
    .scaleRadial()
    .domain([0, d3.max(data, (d) => d.Apogee)])
    .range([innerRadius, outerRadius]);
}

function generateYAxis(y) {
  const yAxis = d3
    .select(".globalgroup")
    .append("g")
    .attr("text-anchor", "middle")
    .selectAll("g.y-axis")
    .data(y.ticks(5).slice(1));
  const g = yAxis.enter().append("g").merge(yAxis).attr("class", "y-axis");
  g.attr("fill", "none")
    .append("circle")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.7)
    .attr("r", y);
  g.append("text")
    .attr("y", (d) => -y(d))
    .attr("dy", "1em")
    .attr("dx", "-1em")
    .attr("fill", "#fff")
    .text(y.tickFormat(8, "s"));
}

function generateXAxis(x, year) {
  // This creates the state names in the example.
  // We will use this to create the day labels
  const xAxis = d3
    .select(".globalgroup")
    .append("g")
    .attr("text-anchor", "left")
    .selectAll("g.x-axis")
    .data(getDatesOfYear(year));
  const transformed = xAxis
    .enter()
    .append("g")
    .merge(xAxis)
    .attr("class", "x-axis")
    .attr(
      "transform",
      (d) => `
            rotate(${((x(d) + x.bandwidth() / 2) * 180) / Math.PI - 90})
            translate(${outerRadius},0)
            `
    );
  transformed
    .append("text")
    .attr("fill", "#fff")
    .attr("transform", "translate(8,5)")
    .text((d) => makeCalDate(d));
  transformed
    .append("line")
    .attr("x2", 5)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);
}

// TODO: shift line slightly left so it's in between months
// Fix text orientation issues
function generateMonthAxis(x, year) {
  const monthAxis = d3
    .select(".globalgroup")
    .selectAll("g.month-axis")
    .data(getDatesOfYear(year).filter((d) => d.getDate() === 1));
  monthAxis
    .enter()
    .append("g")
    .merge(monthAxis)
    .attr("class", "month-axis")
    .attr(
      "transform",
      (d) => `
          rotate(${((x(d) + x.bandwidth() / 2) * 180) / Math.PI - 90})
          translate(${outerRadius},0)
        `
    )
    .append("line")
    .attr("x2", -(outerRadius - innerRadius))
    .attr("stroke", "#fff")
    .append("text")
    .attr("transform", (d) =>
      (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
        ? "rotate(90)translate(3,19)"
        : "rotate(-90)translate(3,-12)"
    )
    .text((d) => months[d.getMonth()]);
}

function plotSatellites(x, y, data, year) {
  const satellites = d3
    .select(".globalgroup")
    .selectAll(".sat-transform,.sat-point");
  satellites.remove();
  const transformed = satellites
    .data(data)
    .enter()
    .append("g")
    .merge(satellites)
    .attr("class", "sat-trasform")
    .attr(
      "transform",
      (d) => `
          rotate(${
            ((x(d["Launch date"]) + x.bandwidth() / 2) * 180) / Math.PI - 90
          })
        `
    );
  transformed.insert("svg:title").text((d) => JSON.stringify(d, null, 4));
  transformed
    .append("circle")
    .attr("class", "sat-point")
    .attr("r", 5)
    .transition()
    .ease(d3.easeLinear)
    .duration(transitionDuration)
    .attr("fill", (d) =>
      color(d.Classification.length ? d.Classification[0] : "Unknown")
    )
    .attr("cx", (d) => y(d.Apogee))
    .attr("cy", 0);
}

function extractCategories(data) {
  // Assumes you're dealing with data from a year
  return [["Unclassified"], ...data.map((v) => v.Classification)].flat();
}

function generateLegend(data) {
  const categories = [
    "Unclassified",
    ...new Set(data.map((v) => v.Classification).flat()),
  ].sort();
  const g = d3
    .select(".globalgroup")
    .append("g")
    .selectAll("g")
    .data(categories)
    .join("g")
    .attr(
      "transform",
      (d, i) =>
        `translate(-${innerRadius - 100},${
          (i - (categories.length - 1) / 2) * 20
        })`
    );
  g.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d) => color(d));
  g.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .attr("stroke", "#000")
    .attr("stroke-width", ".2")
    .attr("fill", "#fff")
    .text((d) => d);
}

function renderGlobe() {
  d3.select("g")
    .append("image")
    .attr("xlink:href", "http://localhost/static/earth.svg")
    .attr("viewBox", `0 0 ${innerRadius * 2} ${innerRadius * 2}`)
    .attr("transform", `translate(-${innerRadius}, -${innerRadius})`)
    .attr("width", `${innerRadius * 2}`)
    .attr("height", `${innerRadius * 2}`)
    .attr("class", "earth");
}

function renderMoon() {
  d3.select("g")
    .append("image")
    .attr("xlink:href", "http://localhost/static/moon.svg")
    .attr("viewBox", `0 0 ${innerRadius / 2} ${innerRadius / 2}`)
    .attr("transform", `translate(${outerRadius / 1.5}, -${outerRadius})`)
    .attr("width", `${innerRadius / 2}`) // convenient way to make it scale with the calendar
    .attr("height", `${innerRadius / 2}`)
    .attr("class", "moon")
    .insert("svg:title")
    .text(
      "The moon's actual apogee is roughly 406000 kilometers. \nThat's outside our scale!"
    );
}

function renderYear(year) {
  let g = d3.select(".globalgroup");
  let yearDisplay = d3.select(".year-display").node()
    ? d3.select(".year-display")
    : g.append("text");
  yearDisplay
    .attr("transform", `translate(-${outerRadius + 50}, -${outerRadius - 50})`)
    .attr("class", "year-display")
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "#fff")
    .attr("style", "font-size: 8em;")
    .transition()
    .text(year);
}

const svg = d3
  .select(".svg-mount")
  .append("svg")
  .attr("width", actual_width)
  .attr("height", actual_height);

const g = svg
  .append("g")
  .attr("transform", `translate(${actual_width / 2},${actual_height / 2})`)
  .classed("globalgroup", true);

function render_graph(year, data) {
  unrender_graph();
  renderYear(year);
  const yearData = data[year];
  let x = generateXScale(year);
  let y = generateYScale(yearData);
  generateLegend(yearData);
  generateXAxis(x, year);
  generateYAxis(y);
  generateMonthAxis(x, year);
  plotSatellites(x, y, yearData, year);
}

function unrender_graph() {
  d3.select("svg g").selectAll("g,text").remove();
}

function init_render(year, data) {
  renderGlobe();
  renderMoon();
  render_graph(year, data);
}
