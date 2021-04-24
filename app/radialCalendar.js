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
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.5)
    .attr("r", y);
  g.append("text")
    .attr("y", (d) => -y(d))
    .attr("dy", "1em")
    .attr("dx", "-1em")
    .attr("stroke", "#fff")
    .attr("stroke-width", 5)
    .text(y.tickFormat(8, "s"))
    .clone(true)
    .attr("fill", "#000")
    .attr("stroke", "none");
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
  xAxis
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
    )
    .append("text")
    .attr("transform", "translate(8,5)")
    .text((d) => makeCalDate(d))
    .append("line")
    .attr("x2", 5)
    .attr("stroke", "#000");
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
    .attr("stroke", "#000")
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
    .selectAll("g.sat-transform")
    .data(data);
  satellites
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
    )
    .append("circle")
    .transition()
    .ease(d3.easeLinear)
    .duration(transitionDuration)
    .attr("r", 5)
    .attr("fill", "blue")
    .attr("cx", (d) => y(d.Apogee))
    .attr("cy", 0);

  // .insert("svg:title")
  // .text((d) => JSON.stringify(d, null, 4));
}

// TODO: Make this show up correctly
function renderGlobe() {
  d3.select("g")
    .append("image")
    .attr("xlink:href", "http://localhost/earth.svg")
    .attr("viewBox", `0 0 ${innerRadius * 2} ${innerRadius * 2}`)
    .attr("transform", `translate(-${innerRadius}, -${innerRadius})`)
    .attr("width", `${innerRadius * 2}`)
    .attr("height", `${innerRadius * 2}`);
}

function renderYear(year) {
  d3.select("g")
    .append("text")
    .attr("x", -900)
    .attr("y", -800)
    .attr("fill", "black")
    .attr("style", "font-size: 8em;")
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
  generateXAxis(x, year);
  generateYAxis(y);
  generateMonthAxis(x, year);
  plotSatellites(x, y, yearData, year);
}

function unrender_graph() {
  console.log("Unrender graph");
  d3.select("svg g").selectAll("g,text").remove();
}

function init_render(year, data) {
  renderGlobe();
  render_graph(year, data);
}
