var satdata = [];
var waiting = true;

async function load_json(callback) {
  d3.json("./n2yo.json").then(function (data) {
    data.map((s) => {
      if (s !== null) {
        s["Launch date"] = n2yoDatetoDate(s["Launch date"]);
        s["Decay date"] = n2yoDatetoDate(s["Decay date"]);
        s.Apogee = parseFloat(s.Apogee.replace(/,| km/gi, ""));
        s.Perigee = parseFloat(s.Perigee.replace(/,| km/gi, ""));
        satdata.push(s);
      }
    });
  });
  callback();
}

async function wait_for_json(to_call) {
  function callback() {
    waiting = true;
  }

  await load_json(callback);

  var interval = setInterval(function () {
    if (waiting === true) {
      clearInterval(interval);
      to_call();
    }
  }, 100);
}

function main() {
  var year = 2021;
  console.log(year);
  console.log(satdata);

  render_graph(year, satdata);
}

wait_for_json(main);
