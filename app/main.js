var satdata = {};
var waiting = true;

async function load_json(callback) {
  d3.json("./n2yo.json").then(function (data) {
    for (var k in data) {
      satdata[k] = [];
      for (var i in data[k]) {
        let sat = data[k][i];
        sat["Launch date"] = n2yoDatetoDate(sat["Launch date"]);
        sat["Decay date"] = n2yoDatetoDate(sat["Decay date"]);
        sat.Apogee = parseFloat(sat.Apogee);
        sat.Perigee = parseFloat(sat.Perigee);
        satdata[k].push(sat);
      }
    }
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
  init_render(year, satdata);
}

wait_for_json(main);
