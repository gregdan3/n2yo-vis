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
const cx = actual_width / 2;
const cy = actual_width / 2;
const outerRadius = Math.min(width, height) / 2;
const innerRadius = outerRadius / 3;

var year = 2021;

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
  var end = new Date(year + 1, 0, 1);
  var daysOfYear = [];
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
    .domain([0, d3.max(data, (d) => d.apogee)])
    .range([innerRadius, outerRadius]);
}

function generateYAxis() {
  return (g) =>
    g.attr("text-anchor", "middle").call((g) =>
      g
        .selectAll("g")
        .data(y.ticks(5).slice(1))
        .join("g")
        .attr("fill", "none")
        .call((g) =>
          g
            .append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("r", y)
        )
        .call((g) =>
          g
            .append("text")
            .attr("y", (d) => -y(d))
            .attr("dy", "1em")
            .attr("dx", "-1em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(5, "s"))
            .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")
        )
    );
}

function generateXAxis(year) {
  // This creates the state names in the example.
  // We will use this to create the day labels
  return (g) =>
    g.attr("text-anchor", "left").call((g) =>
      g
        .selectAll("g")
        .data(getDatesOfYear(year))
        .join("g")
        .attr(
          "transform",
          (d) => `
            rotate(${((x(d) + x.bandwidth() / 2) * 180) / Math.PI - 90})
            translate(${outerRadius},0)
            `
        )
        .call((g) => g.append("line").attr("x2", 5).attr("stroke", "#000"))
        .call((g) =>
          g
            .append("text")
            .attr("transform", "translate(8,5)")
            // .attr("transform", (d) => {
            //   let position =
            //     (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI);
            //   return position < Math.PI / 2 || position > (3 * Math.PI) / 2
            //     ? "translate(80,5) scale(-1,-1)"
            //     : "translate(8,-5)";
            // })
            .text((d) => makeCalDate(d))
        )
    );
}

// TODO: shift line slightly left so it's in between months
// Fix text orientation issues
function generateMonthAxis(year) {
  return (g) =>
    g.attr("text-anchor", "left").call((g) =>
      g
        .selectAll("g")
        .data(getDatesOfYear(year).filter((d) => d.getDate() === 1))
        .join("g")
        .attr(
          "transform",
          (d) => `
          rotate(${((x(d) + x.bandwidth() / 2) * 180) / Math.PI - 90})
          translate(${outerRadius},0)
        `
        )
        .call((g) =>
          g
            .append("line")
            .attr("x2", -(outerRadius - innerRadius))
            .attr("stroke", "#000")
        )
        .call((g) =>
          g
            .append("text")
            .attr("transform", (d) =>
              (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                ? "rotate(90)translate(3,19)"
                : "rotate(-90)translate(3,-12)"
            )
            .text((d) => months[d.getMonth()])
        )
    );
}

// var arc = d3
//   .arc()
//   .innerRadius((d) => y(d[0]))
//   .outerRadius((d) => y(d[1]))
//   .startAngle((d) => x(d.data["Launch date"]))
//   .endAngle((d) => x(d.data["Launch date"]) + x.bandwidth())
//   .padAngle(0.01)
//   .padRadius(innerRadius);

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", actual_width)
  .attr("height", actual_height)
  .append("g")
  .attr("transform", `translate(${actual_width / 2},${actual_height / 2})`);

var x = generateXScale(year);
var y = generateXScale(satdata);
svg.append("g").call(generateXAxis(year));
svg.append("g").call(generateYAxis());
svg.append("g").call(generateMonthAxis(year));
