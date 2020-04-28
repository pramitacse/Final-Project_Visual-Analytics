// let width = 1000,
//   height = 250,
//   radius = 5;
let width = d3
    .select("#swarm-wrapper")
    .node()
    .getBoundingClientRect().width,
  height = 250,
  radius = 5;

let svg = d3
  .select("#swarm-wrapper")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg
  .append("line", "svg")
  .classed("main_line", true)
  .attr("x1", 0)
  .attr("y1", height)
  .attr("x2", width)
  .attr("y2", height)
  .attr("stroke-width", 1.5)
  .attr("stroke", "#A3A0A6");

let x = d3.scaleTime().range([0, width]);

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
      d.releaseDate = Date.parse(d.releaseDate);
      return d;
    });

    x.domain(d3.extent(data, d => d.releaseDate));

    function tick() {
      d3.selectAll(".circ")
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        });
    }

    svg
      .selectAll(".circ")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circ")
      .attr("r", radius)
      .attr("cx", function(d) {
        return x(d.releaseDate);
      })
      .attr("cy", function() {
        return height;
      })
      .on("click", function() {
        let circ = d3.select(this);

        circ.style("stroke", "#56C6D8").style("stroke-width", 3);
      });

    let simulation = d3
      .forceSimulation(data)
      .force(
        "x",
        d3
          .forceX(function(d) {
            return x(d.releaseDate);
          })
          .strength(1)
      )
      .force("y", d3.forceY(height).strength(0.15))
      .force("collide", d3.forceCollide(radius))
      //   .stop();
      // //   .alphaDecay(0)
      // //   .alpha(0.12)
      .on("tick", tick);

    // let init_decay;
    // init_decay = setTimeout(function() {
    //   console.log("init alpha decay");
    //   simulation.alphaDecay(0.1);
    // }, 8000);
  },
  error: function() {
    alert("error");
  }
});
