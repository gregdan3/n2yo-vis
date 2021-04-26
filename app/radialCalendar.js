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
const actual_width = 1880;
const width = actual_width - margin.left - margin.right;
const actual_height = 1880;
const height = actual_height - margin.top - margin.bottom;

// Might delete later
const outerRadius = Math.min(width, height) / 2;
const innerRadius = outerRadius / 3;
const colors = [
  "#1316ef",
  "#faff16",
  "#bd0018",
  "#dabfff",
  "#076901",
  "#1ed1ac",
  "#0d8b7d",
  "#1c9ae9",
  "#9ba416",
  "#fc9ef0",
  "#fe4da1",
  "#865602",
  "#027176",
  "#05ed27",
  "#7d024d",
  "#90d8fc",
  "#a3596b",
  "#e46cfb",
  "#439566",
  "#fc4b00",
  "#b7be95",
  "#63688d",
  "#da99b3",
  "#f5b908",
  "#732813",
  "#9cfead",
  "#c57f0d",
  "#144a72",
  "#5ca2a7",
  "#fcd5e2",
  "#bf0182",
  "#10ab13",
  "#5c695b",
  "#6e7a28",
  "#82fdf0",
  "#b6bac4",
  "#7a4a7d",
  "#136acc",
  "#00543d",
  "#fdeb90",
  "#b4d853",
  "#de6f6d",
  "#ac6aab",
  "#ba5017",
  "#f72051",
  "#a8775a",
  "#74bd73",
  "#e0e8ff",
  "#92b2fd",
  "#e300d1",
  "#b053f6",
  "#775043",
  "#949463",
  "#f4c7a2",
  "#c89e89",
  "#5046bf",
  "#7b6876",
  "#962e40",
  "#4e83a2",
  "#00bee3",
  "#768bfc",
  "#3a5358",
  "#85a893",
  "#c6a751",
  "#683443",
  "#8c9eb8",
  "#1be584",
  "#0d7548",
  "#805bb3",
  "#a97e90",
  "#74c40a",
  "#fb9300",
  "#1edee3",
  "#c58ecd",
  "#c5325a",
  "#3d8706",
  "#cae5ac",
  "#7f6e43",
  "#c85691",
  "#d5ff88",
  "#e77739",
  "#d6d4ce",
  "#ffb0b0",
  "#6f9a47",
  "#fe67d9",
  "#87819b",
  "#505e02",
  "#952680",
  "#00ac90",
  "#ab9baf",
  "#8dbbc6",
  "#0f688f",
  "#1cffc3",
  "#59375b",
  "#9b2b01",
  "#967500",
  "#bf84fd",
  "#b9c9f3",
  "#d5b9d3",
  "#fe7fa4",
  "#617abd",
  "#e80805",
  "#6e8467",
  "#d3cb72",
  "#994937",
  "#d24940",
  "#d10ff9",
];

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
const color = d3.scaleOrdinal(colors).domain(classifications);

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

Date.prototype.yearMStrDay = function () {
  var mm = this.getMonth();
  var dd = this.getDate(); //Day of Week
  return [this.getFullYear(), months[mm], dd].join(" "); // padding
};

function n2yoDatetoDate(n2yoDate) {
  return new Date(n2yoDate);
}

function makeCalDate(date) {
  return `${padDate(date.getDate())} ${days[date.getDay()]}`;
}

function makeCalDateReordered(date) {
  return `${days[date.getDay()]} ${padDate(date.getDate())}`;
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

function generateYScale(data, year, orbitStat) {
  let domainmax = year == 1957 ? 10000 : d3.max(data, (d) => d[orbitStat]);
  // no object from 1957 is still in orbit, otherwise breaks our graph
  return d3
    .scaleRadial()
    .domain([0, domainmax])
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
    .attr("stroke-width", 2)
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
  const is_q1_or_q4 = (d) => {
    let pos = (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI);
    return Math.PI / 2 < pos && pos < (3 * Math.PI) / 2;
  };

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
    .attr("class", "date-text")
    .attr("fill", (d) => {
      let day = d.getDay();
      return day == 0 || day == 6 ? "#02bfe7" : "#fff";
    })
    .attr("transform", (d) => {
      let is_q1_q4 = is_q1_or_q4(d);
      return `rotate(${is_q1_q4 ? 0 : -180})
        ${is_q1_q4 ? "translate(8, 5)" : "translate(-8, 5)"}
    `;
    })
    .attr("text-anchor", (d) => {
      let is_q1_q4 = is_q1_or_q4(d);
      return is_q1_q4 ? "left" : "end";
    })
    .text((d) => (is_q1_or_q4(d) ? makeCalDate(d) : makeCalDateReordered(d)));
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
  const transformed = monthAxis
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
    );
  transformed
    .append("line")
    .attr("x2", -(outerRadius - innerRadius))
    .attr("stroke-width", 3)
    .attr("stroke", "#fff");
  transformed
    .append("text")
    .attr("class", "month-text")
    .attr("transform", (d) =>
      (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
        ? "rotate(90)translate(3,19)"
        : "rotate(-90)translate(3,-12)"
    )
    .attr("fill", "white")
    .text((d) => months[d.getMonth()]);
}

function prettyN2yoJSON(satjson) {
  var outstr = "";
  for (var key in satjson) {
    if (satjson[key]) {
      switch (key) {
        /* No key */
        case "Name": // always present
          outstr += `${satjson[key]}\n\n`;
          break;
        /* List of subelements */
        case "Classification":
          if (satjson[key].length > 0) {
            outstr += `${key}:\n`;
            satjson[key].forEach((d) => (outstr += `    ${d}\n`));
            outstr += `\n`;
          }
          break;
        /* Units */
        case "Perigee":
        case "Apogee":
        case "Semi major axis":
          outstr += `${key}: ${satjson[key]} kilometers\n`;
          break;
        case "Inclination":
          outstr += `${key}: ${satjson[key]}°\n`;
          break;
        case "Period":
          outstr += `${key}: ${satjson[key]} minutes\n`;
          break;
        case "Launch date":
        case "Decay date":
          outstr += `${key}: ${satjson[key].yearMStrDay()}\n`;
          break;
        /* No key + extra newlines */
        case "Note":
        case "Info": // one always ends
          outstr += `\n\n${satjson[key]}\n`;
          break;
        default:
          outstr += `${key}: ${satjson[key]}\n`;
      }
    }
  }
  return outstr;
}

function plotSatellites(x, y, data, year, orbitStat) {
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
  transformed.insert("svg:title").text((d) => prettyN2yoJSON(d));
  transformed
    .append("circle")
    .attr("class", "sat-point")
    .attr("r", 5)
    .transition()
    .ease(d3.easeLinear)
    .duration(transitionDuration)
    .attr("fill", (d) =>
      color(d.Classification.length ? d.Classification[0] : "Unclassified")
    )
    .attr("stroke", (d) => (d[orbitStat] ? "black" : "red"))
    .attr("cx", (d) => (d[orbitStat] ? y(d[orbitStat]) : y(1) - 20))
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
  let scale = 1 / (categories.length / 20);
  scale = scale > 1 ? 1 : scale;
  const g = d3
    .select(".globalgroup")
    .append("g")
    .selectAll("g")
    .data(categories)
    .join("g")
    .attr(
      "transform",
      (d, i) =>
        `translate(-${innerRadius - 120},${
          (i - (categories.length - 1) / 2) * (20 * scale)
        })`
    );
  g.append("rect")
    .attr("width", 18 * scale)
    .attr("height", 18 * scale)
    .attr("stroke", "#000")
    .attr("stroke-width", ".2")
    .attr("fill", (d) => color(d));
  g.append("text")
    .attr("x", 24 * scale)
    .attr("y", 9 * scale)
    .attr("dy", "0.35em")
    .attr("stroke", "#000")
    .attr("stroke-width", ".2")
    .attr("fill", "#000")
    .attr("filter", "blur(.07em)")
    .text((d) => d)
    .clone(true)
    .attr("fill", "#fff")
    .attr("stroke", "none")
    .attr("filter", "none");
}

function renderGlobe() {
  d3.select(".globalgroup")
    .append("image")
    .attr("xlink:href", "http://localhost/static/earth.svg")
    .attr("viewBox", `0 0 ${innerRadius * 2} ${innerRadius * 2}`)
    .attr("transform", `translate(-${innerRadius}, -${innerRadius})`)
    .attr("width", `${innerRadius * 2}`)
    .attr("height", `${innerRadius * 2}`)
    .attr("class", "earth");
}

function renderMoon(x, y, year, orbitStat) {
  let moon = {
    moonday: new Date(`${year} February 14`),
    Apogee: 405000,
    Perigee: 356400,
  };
  d3.select(".globalgroup")
    .append("image")
    .attr("xlink:href", "http://localhost/static/moon.svg")
    .attr("viewBox", `0 0 ${innerRadius / 2} ${innerRadius / 2}`)
    .attr(
      "transform",
      `rotate(${((x(moon.moonday) + x.bandwidth() / 2) * 180) / Math.PI - 90})`
    )
    .attr("width", `${innerRadius / 2}`) // convenient way to make it scale with the calendar
    .attr("height", `${innerRadius / 2}`)
    .attr("x", y(moon[orbitStat]) - innerRadius / 4)
    // adjustment to get center closer to rendered stat
    .attr("y", "0")
    .attr("class", "moon")
    .insert("svg:title")
    .text(
      "THE MOON\n\nApogee: 405000 kilometers\nPerigee: 356400 kilometers\nPeriod: 39343 minutes (27.3217 days)\nSynodic period: 42523 minutes (29.53 days)\nSemi major axis: 384400 kilometers\nMass: 7.346 * 10^22 kilograms\nSurface gravity: 1.62 m/s^2\n\nThe synodic period of the Moon is how long the Moon appears to revolve around the Earth, as seen from the Earth's surface.\n\nThe Moon is receding away from the Earth at a rate of 3.8 centimeters per year. One day we'll have to say goodbye, but that day is not soon."
    );
}

function renderYear(year) {
  d3.select(".year-mount")
    .append("text")
    .attr("class", "year-display")
    .text(year);
}

function zoomed({ transform }) {
  svg.attr("transform", transform);
}

const zoom = d3
  .zoom()
  .filter((e) => {
    if (e.type === "wheel") {
      // don't allow zooming without pressing [shift] key
      console.log(`key ${e.shiftKey}`);
      return e.shiftKey;
    }

    return true;
  })
  .translateExtent([
    [0, 0],
    [actual_width, actual_height],
  ])
  //.extent([
  //  [0, 0],
  //  [actual_width, actual_height],
  //])
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

const svg = d3
  .select(".svg-mount")
  .append("svg")
  .attr("width", actual_width)
  .attr("height", actual_height)
  .attr("viewBox", [0, 0, actual_width, actual_height])
  .attr("border", "white solid 1px")
  .append("svg")
  .attr("width", actual_width)
  .attr("height", actual_height)
  .attr("class", "zoom-scale");

// Allow grab for zoom anywhere
svg
  .append("rect")
  .attr("width", actual_width)
  .attr("height", actual_height)
  .attr("fill-opacity", ".01");

const g = svg
  .append("g")
  .attr("transform", `translate(${actual_width / 2},${actual_height / 2})`)
  .classed("globalgroup", true);

svg.call(zoom);

function render_graph(year, data, orbitStat) {
  unrender_graph();
  renderYear(year);
  const yearData = data[year];
  let x = generateXScale(year);
  let y = generateYScale(yearData, year, orbitStat);
  renderMoon(x, y, year, orbitStat);
  generateLegend(yearData);
  generateXAxis(x, year);
  generateYAxis(y);
  generateMonthAxis(x, year);
  plotSatellites(x, y, yearData, year, orbitStat);
}

function unrender_graph() {
  d3.select("svg g").selectAll("g,text,image[class='moon']").remove();
  d3.select(".year-mount").selectAll("text").remove();
  // putting the two together broke calendar remove
}

function init_render(year, data, orbitStat) {
  renderGlobe();
  render_graph(year, data, orbitStat);
}
