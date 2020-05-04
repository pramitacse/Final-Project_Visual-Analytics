// set the dimensions and margins of the graph
let wordCloud_margin = { top: 30, right: 0, bottom: 10, left: 10 },
  wordCloud_width = 300 - wordCloud_margin.left - wordCloud_margin.right,
  wordCloud_height = 200 - wordCloud_margin.top - wordCloud_margin.bottom;

$.ajax({
  url: "/getKeywords",
  type: "GET",
  data: {
    state: "billboard"
    // "dancebility" indicate the danceability
  },
  success: function(data) {
    data = JSON.parse(data);

    myWords = data[0]["keywords"];

    let wordCloud_svg = d3
      .select("#wordCloud-billboard")
      .append("svg")
      .attr(
        "width",
        wordCloud_width + wordCloud_margin.left + wordCloud_margin.right
      )
      .attr(
        "height",
        wordCloud_height + wordCloud_margin.top + wordCloud_margin.bottom
      )
      .append("g")
      .attr(
        "transform",
        "translate(" + wordCloud_margin.left + "," + wordCloud_margin.top + ")"
      );

    let layout = d3.layout
      .cloud()
      .size([wordCloud_width, wordCloud_height])
      .words(
        myWords.map(function(d) {
          return { text: d };
        })
      )
      .padding(3)
      .rotate(function() {
        return ~~(Math.random() * 2) * 90;
      })
      .fontSize(15)
      .on("end", draw);

    layout.start();

    function draw(words) {
      wordCloud_svg
        .append("g")
        .attr(
          "transform",
          "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function(d) {
          return d.size + "px";
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
          return d.text;
        });
    }
  },
  error: function(err) {
    console.log(err);
  }
});

$.ajax({
  url: "/getKeywords",
  type: "GET",
  data: {
    state: "top50"
    // "dancebility" indicate the danceability
  },
  success: function(data) {
    data = JSON.parse(data);
    myWords = data[0]["keywords"];

    let wordCloud_svg = d3
      .select("#wordCloud-top50")
      .append("svg")
      .attr(
        "width",
        wordCloud_width + wordCloud_margin.left + wordCloud_margin.right
      )
      .attr(
        "height",
        wordCloud_height + wordCloud_margin.top + wordCloud_margin.bottom
      )
      .append("g")
      .attr(
        "transform",
        "translate(" + wordCloud_margin.left + "," + wordCloud_margin.top + ")"
      );

    let layout = d3.layout
      .cloud()
      .size([wordCloud_width, wordCloud_height])
      .words(
        myWords.map(function(d) {
          return { text: d };
        })
      )
      .padding(3)
      .rotate(function() {
        return ~~(Math.random() * 2) * 90;
      })
      .fontSize(15)
      .on("end", draw);

    layout.start();

    function draw(words) {
      wordCloud_svg
        .append("g")
        .attr(
          "transform",
          "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function(d) {
          return d.size + "px";
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
          return d.text;
        });
    }
  },
  error: function(err) {
    console.log(err);
  }
});

// append the svg object to the body of the page

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements

// This function takes the output of 'layout' above and draw the words
// Better not to touch it. To change parameters, play with the 'layout' letiable above
