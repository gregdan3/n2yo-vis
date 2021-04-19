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
// leap year
// Note: Update these vals when year is updated
var daysInYear = year % 4 ? 365 : 366;
var numDaysInMonth = [
  31,
  year % 4 ? 28 : 29,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];

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

var x = d3
  .scaleBand()
  .domain(getDatesOfYear(year))
  .range([0, 2 * Math.PI])
  .align(0);

var y = d3
  .scaleRadial()
  .domain([0, d3.max(data, (d) => d.apogee)])
  .range([innerRadius, outerRadius]);

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", actual_width)
  .attr("height", actual_height)
  .append("g");

var yAxis = (g) =>
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
          .attr("dy", "0.35em")
          .attr("stroke", "#fff")
          .attr("stroke-width", 5)
          .text(y.tickFormat(5, "s"))
          .clone(true)
          .attr("fill", "#000")
          .attr("stroke", "none")
      )
  );

// This creates the state names in the example.
// We will use this to create the day labels
var xAxis = (g) =>
  g.attr("text-anchor", "middle").call((g) =>
    g
      .selectAll("g")
      .data(data)
      .join("g")
      .attr(
        "transform",
        (d) => `
          rotate(${
            ((x(d["Launch date"]) + x.bandwidth() / 2) * 180) / Math.PI - 90
          })
          translate(${outerRadius},0)
        `
      )
      .call((g) => g.append("line").attr("x2", -5).attr("stroke", "#000"))
      .call((g) =>
        g
          .append("text")
          .attr("transform", (d) =>
            (x(d["Launch date"]) + x.bandwidth() / 2 + Math.PI / 2) %
              (2 * Math.PI) <
            Math.PI
              ? "rotate(90)translate(0,16)"
              : "rotate(-90)translate(0,-9)"
          )
          .text((d) => d.State)
      )
  );

var arc = d3
  .arc()
  .innerRadius((d) => y(d[0]))
  .outerRadius((d) => y(d[1]))
  .startAngle((d) => x(d.data["Launch date"]))
  .endAngle((d) => x(d.data["Launch date"]) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius);

// var arc = d3
//   .arc()
//   .innerRadius(width / 2)
//   .outerRadius(width / 2 + 1)
//   .startAngle(0)
//   .endAngle(-Math.PI * 1.99999);
//
// var path = svg
//   .append("path")
//   .attr("d", arc)
//   .attr("id", "path1")
//   .attr("transform", `translate(${actual_width / 2},${actual_height / 2})`)
//   .attr("fill", "red");
//
// // Draw lines
// var dt = new Date(year + "/01/01");
// var day = dt.getDay();
// var startrads = ((2 * Math.PI) / daysInYear) * day;
// //---center point(width,height)---
// var r = width / 2; //--radius--
// var radialPoints = [];
// var i = 0;
// for (var k = 0; k < daysInYear; k += numDaysInMonth[i]) {
//   var angle = ((k + 31) / daysInYear) * 2 * Math.PI;
//   var x2 = r * Math.cos(angle) + cx;
//   var y2 = r * Math.sin(angle) + cy;
//   radialPoints.push([x2, y2]);
//   i++;
// }
// i = 0;
//
// var myColor = d3
//   .scaleSequential()
//   .domain([0, 12])
//   .interpolator(d3.interpolateViridis);
//
// //
// //---your d3 SVG parent element---
// svg
//   .selectAll("line") //---an empty selection---
//   .data(radialPoints)
//   .enter()
//   .append("svg:line")
//   .attr("x1", cx)
//   .attr("y1", cy)
//   .attr("stroke-width", 5)
//   .attr("x2", function (p) {
//     return p[0];
//   })
//   .attr("y2", function (p) {
//     return p[1];
//   })
//   .attr("stroke", (d, i) => myColor(i));
//
// var earth = svg
//   .append("circle")
//   .attr("cx", cx)
//   .attr("cy", cy)
//   .attr("r", width / 6);
//
// const textXOffset = (i) =>
//   (width / 2 + 2) * Math.cos(((i + 0.8) * 2 * Math.PI) / daysInYear) +
//   actual_width / 2;
// const textYOffset = (i) =>
//   (height / 2 + 2) * Math.sin(((i + 0.8) * 2 * Math.PI) / daysInYear) +
//   actual_height / 2;
//
// svg
//   .selectAll("text")
//   .data(days)
//   .enter()
//   .append("text")
//   .attr("transform", function (d, i) {
//     return (
//       `translate(${textXOffset(i)}, ${textYOffset(i)})` +
//       `rotate(${(i * 360) / daysInYear})`
//     );
//   })
//   .text(function (d) {
//     return d;
//   });
