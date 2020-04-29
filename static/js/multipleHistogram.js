let histo_margin = { top: 10, right: 30, bottom: 30, left: 40 },
  histo_width = 300 - histo_margin.left - histo_margin.right,
  histo_height = 300 - histo_margin.top - histo_margin.bottom;

let tempo_svg = d3
  .select("#music_tempo")
  .append("svg")
  .attr("width", histo_width + histo_margin.left + histo_margin.right)
  .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + histo_margin.left + "," + histo_margin.top + ")"
  );

$.ajax({
  url: "/getFeatureData",
  type: "GET",
  data: {
    feature: "temp"
    // "temp" indicate the tempo
  },
  success: function(data) {
    data = JSON.parse(data)[0];

    top50_feature = data["top50"];
    billboard_feature = data["billboard"];

    top50_feature.forEach(d => {
      d.temp = +d.temp;
    });

    billboard_feature.forEach(d => {
      d.temp = +d.temp;
    });

    let x = d3.scaleLinear().range([0, histo_width]);

    x.domain([
      Math.min(
        d3.min(top50_feature, d => d.temp),
        d3.min(billboard_feature, d => d.temp)
      ),
      Math.max(
        d3.max(top50_feature, d => d.temp),
        d3.max(billboard_feature, d => d.temp)
      )
    ]);

    tempo_svg
      .append("g")
      .attr("transform", "translate(0," + histo_height + ")")
      .call(d3.axisBottom(x));

    let histogram = d3
      .histogram()
      .value(function(d) {
        return d.temp;
      }) // I need to give the vector of value
      .domain(x.domain()) // then the domain of the graphic
      .thresholds(x.ticks(30)); // then the numbers of bins
    // And apply this function to data to get the bins

    let bins1 = histogram(billboard_feature);
    let bins2 = histogram(top50_feature);

    let y = d3.scaleLinear().range([histo_height, 0]);
    y.domain([
      0,
      150
      //   d3.max(bins1, function(d) {
      //     return d.length;
      //   })
    ]); // d3.hist has to be called before the Y axis obviously

    tempo_svg.append("g").call(d3.axisLeft(y));

    // // append the bar rectangles to the svg element
    tempo_svg
      .selectAll(".tempo_bin1")
      .data(bins1)
      .enter()
      .append("rect")
      .attr("class", "tempo_bin1")
      .attr("x", 1)
      .attr("transform", function(d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function(d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function(d) {
        return histo_height - y(d.length);
      })
      .style("fill", "blue")
      .style("opacity", 0.3);

    tempo_svg
      .selectAll(".tempo_bin2")
      .data(bins2)
      .enter()
      .append("rect")
      .attr("class", "tempo_bin2")
      .attr("x", 1)
      .attr("transform", function(d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function(d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function(d) {
        return histo_height - y(d.length);
      })
      .style("fill", "green")
      .style("opacity", 1);
  },
  error: function(err) {
    alert("error: music tempo");
  }
});
