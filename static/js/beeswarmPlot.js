// let width = 1000,
//   height = 250,
//   radius = 5;
let swarm_margin = { top: 20, right: 50, bottom: 20, left: 10 };

let width =
    d3
      .select("#swarm-wrapper")
      .node()
      .getBoundingClientRect().width -
    swarm_margin.right -
    swarm_margin.left,
  height = 200 - swarm_margin.top - swarm_margin.bottom,
  radius = 5;

let svg = d3
  .select("#swarm-wrapper")
  .append("svg")
  .attr("width", width + swarm_margin.left + swarm_margin.right)
  .attr("height", height + swarm_margin.top + swarm_margin.bottom);

let swarm_container = svg.attr(
  "transform",
  "translate(" + swarm_margin.left + ",0)"
);
swarm_container
  .append("line", "svg")
  .classed("main_line", true)
  .attr("x1", swarm_margin.left)
  .attr("y1", (height * 2) / 3)
  .attr("x2", width)
  .attr("y2", (height * 2) / 3)
  .attr("stroke-width", 1.5)
  .attr("stroke", "#A3A0A6");

let x = d3.scaleTime().range([swarm_margin.left, width]);

let parseTime = d3.timeParse("%Y-%m-%d");

let data_set = "one";

$.ajax({
  url: "/getMusic",
  type: "GET",
  data: {
    state: "billboard"
  },
  success: function(data) {
    data = JSON.parse(data);

    data.forEach(function(d) {
      d.strDate = d.releaseDate;

      if (d.releaseDate.length == 4) {
        d.releaseDate = d.releaseDate + "-01-01";
      }
      d.releaseDate = parseTime(d.releaseDate);
      d.rank = +d.rank;
      return d;
    });

    x.domain(d3.extent(data, d => d.releaseDate));

    function tick() {
      d3.selectAll(".circ")
        .attr("cx", function(d) {
          //   console.log(d);
          //   return x(d.x);
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        });
    }

    let circles = swarm_container
      .selectAll(".circ")
      .data(data)
      .enter();

    circles
      .append("defs")
      .append("pattern")
      .attr("id", function(d) {
        return d.track + "-icon";
      }) // just create a unique id (id comes from the json)
      .attr("width", 1)
      .attr("height", 1)
      .attr("patternContentUnits", "objectBoundingBox")
      .append("svg:image")
      .attr("xlink:xlink:href", function(d) {
        return d.image_path;
      }) // "icon" is my image url. It comes from json too. The double xlink:xlink is a necessary hack (first "xlink:" is lost...).
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", 1)
      .attr("width", 1)
      .attr("preserveAspectRatio", "xMinYMin slice");

    circles
      .append("circle")
      .attr("class", "circ")
      .attr("r", d => {
        let tempR = 10 / Math.log(d.rank + 1);

        if (tempR < 3) {
          return 4;
        }

        return tempR;
      })
      .attr("cx", function(d) {
        return x(d.releaseDate);
      })
      .attr("cy", function() {
        return (height * 2) / 3;
      })
      .on("click", function() {})
      .on("mouseover", function(d) {
        let circ = d3
          .select(this)
          .style("stroke", "#56C6D8")
          .style("stroke-width", 3);
        console.log(d.strDate);
      })
      .on("mouseout", function(d) {
        let circ = d3
          .select(this)
          .style("stroke", null)
          .style("stroke-width", 0);
      })
      .style("fill", d => {
        let tempR = 10 / Math.log(d.rank + 1);

        if (tempR < 4) {
          return;
        }

        return "url(#" + d.track + "-icon)";
      })
      .style("fill-opacity", d => {
        let tempR = 10 / Math.log(d.rank + 1);
        if (tempR < 4) {
          return 0.4;
        }
        return 1;
      });

    let simulation = d3
      .forceSimulation(data)
      .force(
        "x",
        d3
          .forceX(function(d) {
            return x(d.releaseDate);
          })
          .strength(2)
      )
      .force("y", d3.forceY((height * 2) / 3).strength(0.3))
      .force(
        "collide",
        d3.forceCollide(d => {
          let tempR = 10 / Math.log(d.rank + 1);
          if (tempR < 4) {
            return 4;
          }
          return tempR;
        })
      )
      //   .stop();
      // //   .alphaDecay(0)
      // //   .alpha(0.12)
      .on("tick", tick);
  },
  error: function() {
    alert("error: beeswarm");
  }
});
