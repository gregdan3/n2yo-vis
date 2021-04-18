var satdata = [];
var waiting = true;

async function load_json(callback) {
  d3.json("./n2yo.json", function (data) {
    satdata.push(data);
  });
  callback();
}

async function wait_for_json(main) {
  function callback() {
    waiting = true;
  }

  await load_json(callback);

  var interval = setInterval(function () {
    if (waiting === true) {
      clearInterval(interval);
      main();
    }
  }, 100);
}

function main() {}

// wait_for_json(main);
